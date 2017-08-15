<aura:application template="skuid:skuidtemplate" access="global">
	<aura:attribute name="type" type="String" required="false" access="global" default=""/>
    <aura:dependency resource="flexipage:*"/>
    <skuid:page page="PageBuilder" useURLParameters="true" type="{!v.type}"></skuid:page>
</aura:application>