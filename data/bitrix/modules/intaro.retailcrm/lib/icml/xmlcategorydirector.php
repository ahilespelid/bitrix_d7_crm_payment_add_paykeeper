<?php


namespace Intaro\RetailCrm\Icml;

use Bitrix\Main\ArgumentException;
use Bitrix\Main\ORM\Objectify\Collection;
use Bitrix\Main\ORM\Objectify\EntityObject;
use Bitrix\Main\SystemException;
use Intaro\RetailCrm\Model\Bitrix\Xml\XmlCategory;
use Intaro\RetailCrm\Model\Bitrix\Xml\XmlSetup;
use Intaro\RetailCrm\Repository\CatalogRepository;
use Intaro\RetailCrm\Repository\FileRepository;
use Intaro\RetailCrm\Repository\SiteRepository;

/**
 * Class XmlCategoryDirector
 * @package Intaro\RetailCrm\Icml
 */
class XmlCategoryDirector
{
    private const MILLION = 1000000;
    
    /**
     * @var \Intaro\RetailCrm\Repository\CatalogRepository
     */
    private $catalogRepository;
    
    /**
     * @var array
     */
    private $iblocksForExport;
    
    /**
     * @var \Intaro\RetailCrm\Icml\XmlCategoryFactory
     */
    private $xmlCategoryFactory;
    
    /**
     * @var \Intaro\RetailCrm\Repository\FileRepository
     */
    private $fileRepository;
    
    public function __construct(XmlSetup $setup)
    {
        $this->iblocksForExport   = $setup->iblocksForExport;
        $this->xmlCategoryFactory = new XmlCategoryFactory();
        $this->fileRepository     = new FileRepository(SiteRepository::getDefaultServerName());
        $this->catalogRepository  = new CatalogRepository();

        $this->catalogRepository->setLoadNotActive($setup->loadNonActivity);
    }
    
    /**
     * @return XmlCategory[]
     */
    public function getXmlCategories(): array
    {
        $xmlCategories = [];
        
        foreach ($this->iblocksForExport as $iblockId) {
            $categories = $this->catalogRepository->getCategoriesByIblockId($iblockId);
            
            if ($categories === null) {
                $categoryId  = self::MILLION + $iblockId;
                $xmlCategory = $this->makeXmlCategoryFromIblock($iblockId, $categoryId);
                
                if (!$xmlCategory) {
                    continue;
                }
                
                $xmlCategories[$categoryId] = $xmlCategory;
            }
            
            $xmlCategories = array_merge($xmlCategories, $this->getXmlSubCategories($categories));
        }
        
        return $xmlCategories;
    }
    
    /**
     * ���������� ��������� ������������ ���������
     *
     * @param \Bitrix\Main\ORM\Objectify\Collection $categories
     * @return XmlCategory[]
     */
    public function getXmlSubCategories(Collection $categories): array
    {
        $xmlCategories = [];
        
        foreach ($categories as $categoryKey => $category) {
            if (!$category instanceof EntityObject) {
                continue;
            }
            
            try {

                $xmlCategory = $this->xmlCategoryFactory->create(
                    $category,
                    $this->fileRepository->getImageUrl($category->get('PICTURE'), $category->get('IBLOCK_ID'))
                );
                
                if (!$xmlCategory) {
                    continue;
                }
                
                $xmlCategories[$categoryKey] = $this->xmlCategoryFactory->create(
                    $category,
                    $this->fileRepository->getImageUrl($category->get('PICTURE'), $category->get('IBLOCK_ID'))
                );
            } catch (ArgumentException | SystemException $exception) {
                AddMessage2Log($exception->getMessage());
            }
        }
        
        return $xmlCategories;
    }
    
    /**
     * ������� XmlCategory �� ���������
     *
     * @param int $iblockId
     * @param int $categoryId
     * @return \Intaro\RetailCrm\Model\Bitrix\Xml\XmlCategory|null
     */
    public function makeXmlCategoryFromIblock(int $iblockId, int $categoryId): ?XmlCategory
    {
        $iblock = $this->catalogRepository->getIblockById($iblockId);
        
        if ($iblock === null) {
            return null;
        }
    
        try {
            return $this->xmlCategoryFactory->create(
                $iblock,
                $this->fileRepository->getImageUrl($iblock->get('PICTURE'), $iblockId),
                $categoryId
            );
        } catch (ArgumentException | SystemException $exception) {
            AddMessage2Log($exception->getMessage());
        }
    }
}
