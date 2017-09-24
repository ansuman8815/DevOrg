<aura:application >
    <ltng:require scripts="{! $Resource.P360JqueryResources + '/jquery-2.2.4.min.js'}"/>
    <ltng:require styles="{! $Resource.P360JqueryResources + '/jquery.dataTables.min.css'}"/>
    <ltng:require scripts="{! $Resource.P360JqueryResources + '/jQueryDataTableJs.js'}"/>
  <!-- <c:TestDataTable />	
    <c:testTable />	-->
    <c:testExpandCollapsibleDataTable />
</aura:application>