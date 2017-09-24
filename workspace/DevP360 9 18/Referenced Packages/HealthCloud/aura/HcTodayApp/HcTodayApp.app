<!--
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Today app, a app container to hold today page app components
 * @since 200
-->
<aura:application extends="HealthCloudGA:baseOutApp" access="global">
    <aura:dependency resource="forceChatter:feed" />
    <aura:dependency resource="HealthCloudGA:HcTodayPageBanner" />
    <aura:dependency resource="HealthCloudGA:HcTodayPageContainers" />
    <aura:dependency resource="HealthCloudGA:HcHelpTrayDropDown" />
    <aura:handler event="aura:systemError" action="{!c.showSystemError}" />
</aura:application>