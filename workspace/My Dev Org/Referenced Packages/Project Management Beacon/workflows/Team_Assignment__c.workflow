<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <alerts>
        <fullName>Mail_To_Resource_on_Intimation_of</fullName>
        <description>Mail To Resource on Intimation of Assignment of Task</description>
        <protected>false</protected>
        <recipients>
            <field>Email_to_Resource__c</field>
            <type>email</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>ProjectMgmt_EmailTemplate/Initimation_Mail_to_Resources_on_Assignment_of_relevant_Task_and_Request1</template>
    </alerts>
    <alerts>
        <fullName>Task_Created_Email_to_Resource</fullName>
        <description>Task Created Email to Resource</description>
        <protected>false</protected>
        <recipients>
            <field>Email_to_Resource__c</field>
            <type>email</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>ProjectMgmt_EmailTemplate/Initimation_Mail_to_Resources_on_Assignment_of_relevant_Task_Created1</template>
    </alerts>
    <fieldUpdates>
        <fullName>Consumed_Amount_field_Update</fullName>
        <field>Consumed_Amount__c</field>
        <formula>Cost__c</formula>
        <name>Consumed Amount field Update</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>TA_EMail_Update</fullName>
        <field>Email_to_Resource__c</field>
        <formula>Resource_ID__r.Resource_Name__r.Email</formula>
        <name>TA EMail Update</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>Consumed Amount</fullName>
        <actions>
            <name>Consumed_Amount_field_Update</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Team_Assignment__c.Cost__c</field>
            <operation>notEqual</operation>
        </criteriaItems>
        <triggerType>onAllChanges</triggerType>
    </rules>
    <rules>
        <fullName>EMail Update to TeamAssignment</fullName>
        <actions>
            <name>TA_EMail_Update</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Team_Assignment__c.Resource_Name__c</field>
            <operation>notEqual</operation>
        </criteriaItems>
        <triggerType>onAllChanges</triggerType>
    </rules>
    <rules>
        <fullName>Mail to Resources</fullName>
        <actions>
            <name>Mail_To_Resource_on_Intimation_of</name>
            <type>Alert</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Task__c.Status__c</field>
            <operation>equals</operation>
            <value>Approved</value>
        </criteriaItems>
        <triggerType>onAllChanges</triggerType>
    </rules>
    <rules>
        <fullName>Task Created Status mail to TA Resource</fullName>
        <actions>
            <name>Task_Created_Email_to_Resource</name>
            <type>Alert</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Task__c.Status__c</field>
            <operation>equals</operation>
            <value>Created</value>
        </criteriaItems>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Team Assigment start date assigning to St_Date in resource</fullName>
        <active>false</active>
        <criteriaItems>
            <field>Task__c.Task_Start_Date__c</field>
            <operation>notEqual</operation>
        </criteriaItems>
        <triggerType>onAllChanges</triggerType>
    </rules>
</Workflow>
