<aura:application >
    <aura:attribute name="encounterid" type="String" default="a0R630000017r22"/>
    
    <c:P360CommunityEncounterBanner encounterid="{!v.encounterid}"/>
	<div>
        <div class="floatL palletDetail violet">
            <div class="floatL  palletHeading">
                <p class="palletTitle">Encounter Diagnosis</p>
                <p><c:P360CommunityIcon svgPath="{! $Resource.P360CommunityIcons + '/20-MedicalHistory.svg#Layer_1'}" class="IconStyle" buttonStyle="border:none;  outline:none; background-color:transparent" /></p>
            </div>
            <div class="floatL  palletTable">
                <c:P360CommunityDynamicPallet >  
                    <!--aura:set attribute="patientid" value="{!v.encounterid}" /-->
                    <aura:set attribute="whereclause" value="{!v.encounterid}" />
                    <aura:set attribute="listName" value="Encounter Diagnosis" />
                    <aura:set attribute="tableName" value="enc_diagonis" />
                </c:P360CommunityDynamicPallet>
            </div>
        </div>
        <div class="floatL palletDetail green mr0">
            <div class="floatL  palletHeading">
                <p class="palletTitle">Encounter Medications</p>
                <c:P360CommunityIcon svgPath="{! $Resource.P360CommunityIcons + '/21-SurgicalHistory.svg#Layer_1'}" class="IconStyle" buttonStyle="border:none;  outline:none; background-color:transparent" />
            </div>
            <div class="floatL  palletTable">
                <c:P360CommunityDynamicPallet >  
                    <!--aura:set attribute="patientid" value="{!v.patientid}" /-->
                    <aura:set attribute="whereclause" value="{!v.encounterid}" />
                    <aura:set attribute="listName" value="Encounter Medications" />
                    <aura:set attribute="tableName" value="enc_medication" />
                </c:P360CommunityDynamicPallet>
            </div> 
        </div>
        <div class="floatL palletDetail golden">
            <div class="floatL  palletHeading">
                <p class="palletTitle">Encounter Procedures	</p>
                <p><c:P360CommunityIcon svgPath="{! $Resource.P360CommunityIcons + '/22-Medication.svg#Layer_1'}" class="IconStyle" buttonStyle="border:none;  outline:none; background-color:transparent" /></p>
            </div>
            <div class="floatL  palletTable">
                <c:P360CommunityDynamicPallet >  
                    <!--aura:set attribute="patientid" value="{!v.patientid}" /-->
                    <aura:set attribute="whereclause" value="{!v.encounterid}" />
                    <aura:set attribute="listName" value="Encounter Procedures" />
                    <aura:set attribute="tableName" value="enc_procedure" />
                </c:P360CommunityDynamicPallet>
            </div>
        </div>
        <div class="floatL palletDetail blue mr0">
            <div class="floatL  palletHeading">
                <p class="palletTitle">Encounter Clinical Notes</p>
                <c:P360CommunityIcon svgPath="{! $Resource.P360CommunityIcons + '/23-L3Encounters.svg#Layer_1'}" class="IconStyle" buttonStyle="border:none;  outline:none; background-color:transparent" />
            </div>
            <div class="floatL  palletTable">
                <c:P360CommunityDynamicPallet >  
                    <!--aura:set attribute="patientid" value="{!v.patientid}" /-->
                    <aura:set attribute="whereclause" value="{!v.encounterid}" />
                    <aura:set attribute="listName" value="Encounter Clinical Notes" />
                    <aura:set attribute="tableName" value="encounter_cnotes" />
                </c:P360CommunityDynamicPallet>
            </div> 
        </div>
	</div>
</aura:application>