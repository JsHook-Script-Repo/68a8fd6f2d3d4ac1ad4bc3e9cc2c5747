// by https://github.com/anysoft
var packageName = common.getlpparam().packageName;
// package 
if (packageName == 'com.dragon.read') {
    // get classloader
    common.hookAllMethods('android.app.ActivityThread', 'performLaunchActivity', null, function (param) {
        var mInitialApplication = common.getObjectField(param.thisObject, 'mInitialApplication');
        var classLoader = common.callMethod(mInitialApplication, 'getClassLoader');
        // hook method 
        common.hookAllConstructors('com.dragon.read.user.h', function (param) {
            if (param.args.length == 2) {
                // common.log('before args[0]:' + com.alibaba.fastjson.JSON.toJSONString(param.args[0]))
                // common.log('before args[1]:' + com.alibaba.fastjson.JSON.toJSONString(param.args[1]))

                // find class
                var InfoResponseClass = common.findClass('com.dragon.read.rpc.model.InfoResponse', classLoader);
                // common.log('findClass: ' + InfoResponseClass);

                // cast java object to jsonobject. then you can modify and set result
                var infoResponse = com.alibaba.fastjson.JSONObject.parse(com.alibaba.fastjson.JSON.toJSONString(param.args[1]));
                // common.toast('infoResponse:' + infoResponse.toJSONString());
                // define var 
                var currentTimeMillis = java.lang.System.currentTimeMillis();
                var expireDay = 365;
                var leftTime = 1000 + 60 * 60 * 24 * expireDay;
                var freeAdLeft = leftTime;
                var expireTime = java.lang.Long.valueOf(currentTimeMillis / 1000 + leftTime);
                var boolTrue = java.lang.Boolean.TRUE
                // common.log('init expireTime = ' + expireTime);

                var data = infoResponse.getJSONObject('data');
                data.put('freeAd', boolTrue);
                data.put('freeAdDay', java.lang.Integer.valueOf(expireDay));
                data.put('freeAdExpire', expireTime);
                data.put('freeAdLeft', java.lang.Long.valueOf(freeAdLeft));
                data.put('hasMedal', boolTrue);
                data.put('vipLastExpiredTime', java.lang.Long.valueOf(1654752180).toString());
                var vipInfo = data.getJSONObject('vipInfo');
                vipInfo.put('continueMonth', boolTrue);
                vipInfo.put('continueMonthBuy', boolTrue);
                vipInfo.put('expireTime', expireTime.toString());
                vipInfo.put('isVip', '1');
                vipInfo.put('leftTime', java.lang.Long.valueOf(leftTime).toString());
                data.put('vipInfo', vipInfo);
                infoResponse.put('data', data);
                //set result into param.args
                param.args[1] = infoResponse.toJavaObject(InfoResponseClass);
                // common.log('after args[1]:' + com.alibaba.fastjson.JSON.toJSONString(param.args[1]))
            }
        }, null);
    });
}
