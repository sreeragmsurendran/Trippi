package com.bikemessenger.floating;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * BikeMessengerModule
 *
 * React Native Native Module that bridges JavaScript to the native Android
 * FloatingWindowService. Provides methods to:
 * - Start/stop the floating overlay widget
 * - Update messages in the floating widget
 * - Check/request overlay permission
 * - Minimize the app (move to background)
 */
public class BikeMessengerModule extends ReactContextBaseJavaModule {

    private static final String TAG = "BikeMessengerModule";
    private static final String MODULE_NAME = "BikeMessengerModule";

    public BikeMessengerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    /**
     * Start the floating overlay widget service
     *
     * @param messagesJson JSON string of messages array
     * @param promise Promise resolved with true on success
     */
    @ReactMethod
    public void startFloatingWidget(String messagesJson, Promise promise) {
        try {
            ReactApplicationContext context = getReactApplicationContext();

            // Check overlay permission first
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.canDrawOverlays(context)) {
                    promise.reject("PERMISSION_DENIED",
                        "SYSTEM_ALERT_WINDOW permission not granted");
                    return;
                }
            }

            Intent serviceIntent = new Intent(context, FloatingWindowService.class);
            serviceIntent.putExtra("messages", messagesJson);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent);
            } else {
                context.startService(serviceIntent);
            }

            Log.i(TAG, "Floating widget service started");
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Failed to start floating widget", e);
            promise.reject("START_FAILED", e.getMessage());
        }
    }

    /**
     * Stop the floating overlay widget service
     *
     * @param promise Promise resolved with true on success
     */
    @ReactMethod
    public void stopFloatingWidget(Promise promise) {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            Intent serviceIntent = new Intent(context, FloatingWindowService.class);
            context.stopService(serviceIntent);

            Log.i(TAG, "Floating widget service stopped");
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Failed to stop floating widget", e);
            promise.reject("STOP_FAILED", e.getMessage());
        }
    }

    /**
     * Update messages in the running floating widget
     *
     * @param messagesJson Updated JSON string of messages
     * @param promise Promise resolved with true on success
     */
    @ReactMethod
    public void updateMessages(String messagesJson, Promise promise) {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            Intent serviceIntent = new Intent(context, FloatingWindowService.class);
            serviceIntent.putExtra("action", "update_messages");
            serviceIntent.putExtra("messages", messagesJson);

            context.startService(serviceIntent);

            Log.i(TAG, "Messages updated in floating widget");
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Failed to update messages", e);
            promise.reject("UPDATE_FAILED", e.getMessage());
        }
    }

    /**
     * Check if the app has SYSTEM_ALERT_WINDOW permission
     *
     * @param promise Promise resolved with boolean
     */
    @ReactMethod
    public void checkOverlayPermission(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                boolean canDraw = Settings.canDrawOverlays(getReactApplicationContext());
                promise.resolve(canDraw);
            } else {
                // Below API 23, permission is granted at install time
                promise.resolve(true);
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to check overlay permission", e);
            promise.reject("CHECK_FAILED", e.getMessage());
        }
    }

    /**
     * Open system settings to grant overlay permission
     */
    @ReactMethod
    public void requestOverlayPermission() {
        try {
            Activity activity = getCurrentActivity();
            if (activity == null) {
                Log.e(TAG, "Current activity is null");
                return;
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Intent intent = new Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + activity.getPackageName())
                );
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(intent);
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to open overlay permission settings", e);
        }
    }

    /**
     * Minimize the React Native activity (move to background)
     */
    @ReactMethod
    public void minimizeApp() {
        try {
            Activity activity = getCurrentActivity();
            if (activity != null) {
                activity.moveTaskToBack(true);
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to minimize app", e);
        }
    }
}
