<!--
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Care team app, a app container to hold care team app components
 * @since 196
 * TODO 1. Need to consolidate healthcare specific resources
-->
<aura:application extends="HealthCloudGA:baseOutApp" access="global">
    <aura:dependency resource="HealthCloudGA:HcSingleCarePlan"/>
	<aura:dependency resource="HealthCloudGA:HcCarePlanBaseCmp"/>
</aura:application>