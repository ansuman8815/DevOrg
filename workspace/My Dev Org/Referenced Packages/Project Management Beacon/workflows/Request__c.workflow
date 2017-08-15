<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <alerts>
        <fullName>Request_status_Approved_and_Module_assigned_mail</fullName>
        <description>Request status Approved and Module assigned mail</description>
        <protected>false</protected>
        <recipients>
            <type>accountOwner</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>ProjectMgmt_EmailTemplate/Request_Approved_status_mail_to_MM1</template>
    </alerts>
    <alerts>
        <fullName>Request_status_opened_mail</fullName>
        <description>Request status opened mail</description>
        <protected>false</protected>
        <recipients>
            <type>owner</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>ProjectMgmt_EmailTemplate/Request_Open_status_sent_mail_to_CPM_and_PA1</template>
    </alerts>
    <alerts>
        <fullName>Request_status_update_tobetested_mail</fullName>
        <description>Request status update tobetested mail</description>
        <protected>false</protected>
        <recipients>
            <type>creator</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>ProjectMgmt_EmailTemplate/Tobetested_request_Mail1</template>
    </alerts>
    <alerts>
        <fullName>Send_mail_to_Request_creator</fullName>
        <description>Send mail to Request creator</description>
        <protected>false</protected>
        <recipients>
            <type>creator</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>ProjectMgmt_EmailTemplate/Request_Creator_mail1</template>
    </alerts>
    <rules>
        <fullName>Email Send to Request Creator</fullName>
        <actions>
            <name>Send_mail_to_Request_creator</name>
            <type>Alert</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Request__c.Status__c</field>
            <operation>notEqual</operation>
        </criteriaItems>
        <triggerType>onCreateOnly</triggerType>
    </rules>
    <rules>
        <fullName>Email sent to request status To be tested</fullName>
        <actions>
            <name>Request_status_update_tobetested_mail</name>
            <type>Alert</type>
        </actions>
        <active>false</active>
        <criteriaItems>
            <field>Request__c.Status__c</field>
            <operation>equals</operation>
            <value>To be Tested</value>
        </criteriaItems>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Request approved and module assigned sent mail to MM</fullName>
        <actions>
            <name>Request_status_Approved_and_Module_assigned_mail</name>
            <type>Alert</type>
        </actions>
        <active>false</active>
        <criteriaItems>
            <field>Request__c.Status__c</field>
            <operation>equals</operation>
            <value>Approved</value>
        </criteriaItems>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Request open status mail to PA and CPM</fullName>
        <actions>
            <name>Request_status_opened_mail</name>
            <type>Alert</type>
        </actions>
        <active>false</active>
        <criteriaItems>
            <field>Request__c.Status__c</field>
            <operation>equals</operation>
            <value>Opened</value>
        </criteriaItems>
        <triggerType>onCreateOnly</triggerType>
    </rules>
</Workflow>
