({
    industrySpecificActionTypes: function(entity){
        if (!$A.util.isUndefinedOrNull(entity) && entity.bucketType === 'RELATED_CASE') {
            return 'careplan';
        }
    }
})