import { Loc, Tag, Dom, Type } from 'main.core';
import { CompanySelector, type Provider } from 'sign.v2.b2e.company-selector';
import { RepresentativeSelector } from 'sign.v2.b2e.representative-selector';
import { DocumentValidation } from 'sign.v2.b2e.document-validation';
import { type Role } from 'sign.v2.api';
import { Hint } from 'sign.v2.helper';

const blockWarningClass = 'sign-document-b2e-parties__item_content--warning';

export class Parties
{
	#companySelector: CompanySelector = null;
	#representativeSelector: RepresentativeSelector = null;
	#documentValidation: DocumentValidation = null;
	#ui = {
		container: HTMLDivElement = null,
		blocks: {
			companyContent: HTMLDivElement = null,
			representativeContent: HTMLDivElement = null,
		},
	};

	constructor(region: string)
	{
		this.#representativeSelector = new RepresentativeSelector({});
		this.#companySelector = new CompanySelector({ region });
		this.#documentValidation = new DocumentValidation();
	}

	setEntityId(entityId: number): void
	{
		this.#companySelector.setOptions({ entityId });
	}

	loadCompany(companyUid: string): void
	{
		this.#companySelector.load(companyUid);
	}

	loadRepresentative(representativeId: number): void
	{
		this.#representativeSelector.load(representativeId);
	}

	loadValidator(memberId: number, role: Role): void
	{
		this.#documentValidation.load(memberId, role);
	}

	getLayout(): HTMLElement
	{
		this.#ui.blocks.companyContent = Tag.render`
			<div class="sign-b2e-settings__item">
				<p class="sign-b2e-settings__item_title">
					<span>${Loc.getMessage('SIGN_PARTIES_ITEM_COMPANY')}</span>
					<span
						data-hint="${Loc.getMessage('SIGN_PARTIES_ITEM_COMPANY_HINT')}"
					></span>
				</p>
				${this.#companySelector.getLayout()}
			</div>
		`;
		Hint.create(this.#ui.blocks.companyContent);
		this.#ui.blocks.representativeContent = Tag.render`
			<div class="sign-b2e-settings__item --representative">
				<p class="sign-b2e-settings__item_title">
					${Loc.getMessage('SIGN_PARTIES_ITEM_REPRESENTATIVE')}
				</p>
				${this.#representativeSelector.getLayout()}
			</div>
		`;
		const providerLayout = Tag.render`
			<div class="sign-b2e-settings__item">
				<p class="sign-b2e-settings__item_title">
					${Loc.getMessage('SIGN_PARTIES_ITEM_PROVIDER')}
				</p>
				${this.#companySelector.getProviderLayout()}
			</div>
		`;
		const validationReviewerLayout = Tag.render`
			<div class="sign-b2e-settings__item --reviewer">
				<p class="sign-b2e-settings__item_title">
					${Loc.getMessage('SIGN_PARTIES_ITEM_VALIDATION_REVIEWER')}
				</p>
				${this.#documentValidation.getReviewerLayout()}
			</div>
		`;
		const validationEditorLayout = Tag.render`
			<div class="sign-b2e-settings__item --editor">
				<p class="sign-b2e-settings__item_title">
					${Loc.getMessage('SIGN_PARTIES_ITEM_VALIDATION_EDITOR')}
				</p>
				${this.#documentValidation.getEditorLayout()}
			</div>
		`;

		return Tag.render`
			<div>
				<h1 class="sign-b2e-settings__header">${Loc.getMessage('SIGN_PARTIES_HEADER')}</h1>
				${this.#ui.blocks.companyContent}
				${providerLayout}
				${this.#ui.blocks.representativeContent}
				${validationReviewerLayout}
				${validationEditorLayout}
			</div>
		`;
	}

	#validate(): boolean
	{
		const validationResults = [
			this.#companySelector.validate(),
			this.#representativeSelector.validate(),
		];

		return validationResults.every((result: boolean) => result === true);
	}

	async save(documentId: string)
	{
		this.#removeWarningFromBlocks();
		if (!this.#validate())
		{
			throw new Error();
		}

		try
		{
			await this.#companySelector.save(documentId);
		}
		catch (e)
		{
			this.#setWarning(this.#ui.blocks.companyContent);
			throw e;
		}
	}

	getSelectedProvider(): Provider | null
	{
		return this.#companySelector.getSelectedCompanyProvider();
	}

	getParties(): { [key: string]: { entityType: string, entityId: ?number, role?: Role } }
	{
		const validationData = this.#documentValidation.getValidationData();

		return {
			representative: {
				entityType: 'user',
				entityId: this.#representativeSelector.getRepresentativeId(),
			},
			company: {
				entityType: 'company',
				entityId: this.#companySelector.getCompanyId(),
			},
			validation: Object.keys(validationData).map((role) => {
				return { entityType: 'user', entityId: validationData[role], role };
			}),
		};
	}

	#setWarning(block: HTMLDivElement): void
	{
		if (Type.isNull(block) || Type.isUndefined(block))
		{
			return;
		}

		Dom.addClass(block, blockWarningClass);
	}

	#removeWarningFromBlocks(): void
	{
		for (const [key, block] of Object.entries(this.#ui.blocks))
		{
			if (Type.isNull(block))
			{
				return;
			}

			Dom.removeClass(block, blockWarningClass);
		}
	}
}