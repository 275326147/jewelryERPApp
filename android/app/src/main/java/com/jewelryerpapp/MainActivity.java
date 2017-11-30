package com.jewelryerpapp;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import cn.jpush.android.api.JPushInterface;
import com.reactnativecomponent.barcode.RCTCapturePackage; 
import cn.jiguang.analytics.android.api.JAnalyticsInterface;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "jewelryERPApp";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);
        JAnalyticsInterface.init(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }
}
