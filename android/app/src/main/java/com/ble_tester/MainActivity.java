package com.ble_tester;

import android.Manifest;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.gun0912.tedpermission.PermissionListener;
import com.gun0912.tedpermission.normal.TedPermission;

import org.devio.rn.splashscreen.SplashScreen;

import java.util.List;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {


//    SplashScreen.show(this);

    new Handler().postDelayed(new Runnable()
    {
      @Override
      public void run()
      {
        SplashScreen.hide(MainActivity.this);

        PermissionListener permissionlistener = new PermissionListener() {
          @Override
          public void onPermissionGranted() {
//            Toast.makeText(MainActivity.this, "Permission Granted", Toast.LENGTH_SHORT).show();
          }
          @Override
          public void onPermissionDenied(List<String> deniedPermissions) {
            Toast.makeText(MainActivity.this, "권한을 거부하면 본 서비스를 이용할 수 없습니다. [설정] > [권한]에서 권한을 허용해주세요.", Toast.LENGTH_SHORT).show();
          }
        };

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
          TedPermission.create()
                  .setPermissionListener(permissionlistener)
//              .setDeniedMessage("권한을 거부하면 본 서비스를 이용할 수 없습니다.\n [설정] > [권한]에서 권한을 허용해주세요.")
                  .setPermissions(Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.ACCESS_COARSE_LOCATION)
                  .check();
        }
        else{
          TedPermission.create()
                  .setPermissionListener(permissionlistener)
//              .setDeniedMessage("권한을 거부하면 본 서비스를 이용할 수 없습니다.\n [설정] > [권한]에서 권한을 허용해주세요.")
                  .setPermissions(Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.ACCESS_COARSE_LOCATION)
                  .check();
        }
      }
    }, 1000);// 0.6초 정도 딜레이를 준 후 시작

    super.onCreate(savedInstanceState);




  }


  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ble_tester";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
