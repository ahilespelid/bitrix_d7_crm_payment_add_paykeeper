<? namespace Bitrix\Main\UpdateSystem;$GLOBALS['____748152280']= array(base64_decode('Y'.'m'.'FzZTY0'.'X2Rl'.'Y29kZQ=='),base64_decode('dW'.'5zZX'.'Jp'.'YWx'.'pe'.'m'.'U'.'='),base64_decode('b3'.'BlbnNzbF9'.'2ZXJpZnk='),base64_decode('dW'.'5'.'z'.'ZXJpY'.'W'.'xp'.'emU='));if(!function_exists(__NAMESPACE__.'\\___2118116708')){function ___2118116708($_970292700){static $_1773710085= false; if($_1773710085 == false) $_1773710085=array('YW'.'xsb3dlZ'.'F9jbG'.'Fzc2'.'Vz','aW5mbw'.'==','c2ln'.'bmF0dXJl','c'.'2hh'.'MjU2'.'V2l'.'0'.'aF'.'J'.'T'.'QU'.'VuY'.'3J5'.'cHRpb24=','aW5mbw'.'='.'=','YWxs'.'b3dl'.'ZF9jbGFzc2Vz','RXJyb3IgdmVyaWZ5I'.'G9wZW5zc'.'2w'.'gW0hDU'.'F'.'A'.'wMV0=','L'.'S0tLS1CRUdJ'.'TiBQV'.'UJ'.'MSUMgS0VZLS0t'.'LS0KTUl'.'JQ'.'kl'.'q'.'QU'.'5CZ2txa'.'GtpRzl'.'3MEJBU'.'U'.'VGQUFP'.'Q0FROEFNSUlCQ2'.'dLQ0'.'FRR'.'UE2'.'aGN4'.'SX'.'FpaXRVWlJNd1'.'lp'.'d'.'WtTVQp'.'oOX'.'hhNWZ'.'FRFlsY2NiVzN2'.'ajh'.'B'.'dmEzNXZ'.'LcVZONGlC'.'OXR'.'x'.'Q1g'.'3'.'al'.'U4N'.'nFBYT'.'J2M'.'zdtYl'.'RGN'.'nBj'.'WT'.'Z'.'I'.'R1'.'BB'.'aF'.'JGCmJwb'.'ndYT1k'.'3WUd'.'4QjFuU0tadkUrakFSYmlMTEJnWj'.'FjRzZ'.'a'.'MG'.'R1dTVp'.'MVhocElSTDFjTj'.'BIa'.'DVm'.'ZXpwalhDNk8KW'.'XhZc'.'TBu'.'VG9IV'.'Gp5UmI'.'xe'.'WN6d3RtaV'.'J3WXF1ZFhnL'.'3'.'hXe'.'HBwcXdGM'.'H'.'RVbGQ'.'z'.'UUJyM2k2'.'OEI4'.'anFNbStUamR'.'l'.'QQ'.'p1L2Z'.'n'.'MUowS'.'k'.'d0Uj'.'Qveks'.'0Rzd'.'ZS'.'k52aG1'.'1aHJSR2t5Q'.'VFWMFRWdTVMRXV'.'nU3hqQX'.'BSbUlKUU5IUU1L'.'MEV'.'oOT'.'N3Ck1ab0ZvU'.'HA5U2dKN0dhRlU4a3'.'pT'.'K0V'.'R'.'Y250WXhiMU5IVUpVSXZ'.'UZGl'.'1'.'UlV'.'lRkt'.'s'.'eVRk'.'eEl'.'ySD'.'ZDTC8'.'v'.'YXBNS'.'D'.'MKRn'.'dJREFR'.'Q'.'UIKL'.'S'.'0tLS1FT'.'k'.'QgUFVCTElDIEtFW'.'S0t'.'L'.'S0t');return base64_decode($_1773710085[$_970292700]);}}; use Bitrix\Main\Application; use Bitrix\Main\Security\Cipher; use Bitrix\Main\Security\SecurityException; class HashCodeParser{ private string $_710172316; public function __construct(string $_710172316){ $this->_710172316= $_710172316;}  public function parse(){ $_401582399= $GLOBALS['____748152280'][0]($this->_710172316); $_401582399= $GLOBALS['____748152280'][1]($_401582399,[___2118116708(0) => false]); if($GLOBALS['____748152280'][2]($_401582399[___2118116708(1)], $_401582399[___2118116708(2)], $this->__867564830(), ___2118116708(3)) == round(0+1)){ $_1827086314= Application::getInstance()->getLicense()->getHashLicenseKey(); $_1674987519= new Cipher(); $_615283911= $_1674987519->decrypt($_401582399[___2118116708(4)], $_1827086314); return $GLOBALS['____748152280'][3]($_615283911,[___2118116708(5) => false]);} throw new SecurityException(___2118116708(6));} private function __867564830(): string{ return ___2118116708(7);}}?>