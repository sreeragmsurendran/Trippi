package com.bikemessenger.floating;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.IBinder;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * FloatingWindowService
 *
 * Android foreground service that creates a system-level overlay window.
 * This window appears on top of ALL other apps (Chrome, Maps, Games, etc.)
 * and provides a draggable floating button + expandable message menu.
 *
 * Uses WindowManager with TYPE_APPLICATION_OVERLAY to draw over other apps.
 * Requires SYSTEM_ALERT_WINDOW permission.
 */
public class FloatingWindowService extends Service {

    private static final String TAG = "FloatingWindowService";
    private static final int BUTTON_SIZE_DP = 60;
    private static final int MENU_WIDTH_DP = 220;
    private static final String NOTIFICATION_CHANNEL_ID = "floating_overlay_channel";
    private static final int NOTIFICATION_ID = 1001;

    private WindowManager windowManager;
    private View floatingButton;
    private View floatingMenu;
    private boolean isMenuVisible = false;

    private WindowManager.LayoutParams buttonParams;
    private WindowManager.LayoutParams menuParams;

    private ArrayList<MessageData> messages = new ArrayList<>();
    private int screenWidth;
    private int screenHeight;

    // Message data holder
    static class MessageData {
        String id;
        String text;
        String icon;
        String color;

        MessageData(String id, String text, String icon, String color) {
            this.id = id;
            this.text = text;
            this.icon = icon;
            this.color = color;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);

        DisplayMetrics metrics = new DisplayMetrics();
        windowManager.getDefaultDisplay().getMetrics(metrics);
        screenWidth = metrics.widthPixels;
        screenHeight = metrics.heightPixels;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Required: foreground service must call startForeground() within ~5s on Android O+
        startForegroundNotification();

        if (intent != null) {
            String action = intent.getStringExtra("action");
            if ("update_messages".equals(action)) {
                String messagesJson = intent.getStringExtra("messages");
                parseMessages(messagesJson);
                if (isMenuVisible) {
                    updateMenuContent();
                }
                return START_STICKY;
            }

            String messagesJson = intent.getStringExtra("messages");
            if (messagesJson != null) {
                parseMessages(messagesJson);
            }
        }

        createFloatingButton();
        return START_STICKY;
    }

    /**
     * Start as foreground service so the system does not kill us (required on Android O+).
     * Without this, startForegroundService() leads to a crash and the overlay never appears.
     */
    private void startForegroundNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "Floating widget",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Shows when the bike messenger floating button is active");
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(channel);

            Notification.Builder builder = new Notification.Builder(this, NOTIFICATION_CHANNEL_ID)
                .setContentTitle("Trippi")
                .setContentText("Floating widget active")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setPriority(Notification.PRIORITY_LOW)
                .setOngoing(true);

            Notification notification = builder.build();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
            } else {
                startForeground(NOTIFICATION_ID, notification);
            }
        }
    }

    private void parseMessages(String json) {
        messages.clear();
        if (json == null) return;

        try {
            JSONArray array = new JSONArray(json);
            for (int i = 0; i < array.length(); i++) {
                JSONObject obj = array.getJSONObject(i);
                messages.add(new MessageData(
                    obj.getString("id"),
                    obj.getString("text"),
                    obj.getString("icon"),
                    obj.getString("color")
                ));
            }
        } catch (JSONException e) {
            Log.e(TAG, "Failed to parse messages JSON", e);
        }
    }

    /**
     * Create the draggable floating button overlay
     */
    private void createFloatingButton() {
        if (floatingButton != null) return;

        int buttonSizePx = dpToPx(BUTTON_SIZE_DP);

        // Create circular button
        floatingButton = new View(this) {
            @Override
            protected void onDraw(android.graphics.Canvas canvas) {
                super.onDraw(canvas);
            }
        };

        // Style the button
        GradientDrawable buttonBg = new GradientDrawable();
        buttonBg.setShape(GradientDrawable.OVAL);
        buttonBg.setColor(Color.parseColor("#FF6B35")); // Accent color
        floatingButton.setBackground(buttonBg);
        floatingButton.setElevation(dpToPx(8));

        // Create an ImageView for the icon (motorcycle)
        // Since we can't use vector icons directly, we use a TextView with Unicode
        LinearLayout buttonLayout = new LinearLayout(this);
        buttonLayout.setOrientation(LinearLayout.VERTICAL);
        buttonLayout.setGravity(Gravity.CENTER);

        TextView iconText = new TextView(this);
        iconText.setText("🏍");
        iconText.setTextSize(24);
        iconText.setGravity(Gravity.CENTER);

        buttonLayout.addView(iconText);
        buttonLayout.setBackground(buttonBg);
        buttonLayout.setElevation(dpToPx(8));

        // Window params for the floating button
        int overlayType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            : WindowManager.LayoutParams.TYPE_PHONE;

        buttonParams = new WindowManager.LayoutParams(
            buttonSizePx,
            buttonSizePx,
            overlayType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        );

        buttonParams.gravity = Gravity.TOP | Gravity.START;
        buttonParams.x = screenWidth - buttonSizePx - dpToPx(16);
        buttonParams.y = screenHeight - buttonSizePx - dpToPx(200);

        // Touch listener for drag + tap
        buttonLayout.setOnTouchListener(new View.OnTouchListener() {
            private int initialX, initialY;
            private float initialTouchX, initialTouchY;
            private boolean isDragging = false;
            private long touchStartTime;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = buttonParams.x;
                        initialY = buttonParams.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        isDragging = false;
                        touchStartTime = System.currentTimeMillis();
                        return true;

                    case MotionEvent.ACTION_MOVE:
                        float dx = event.getRawX() - initialTouchX;
                        float dy = event.getRawY() - initialTouchY;

                        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                            isDragging = true;
                        }

                        if (isDragging) {
                            buttonParams.x = initialX + (int) dx;
                            buttonParams.y = initialY + (int) dy;

                            // Clamp to screen bounds
                            buttonParams.x = Math.max(0, Math.min(buttonParams.x,
                                screenWidth - buttonSizePx));
                            buttonParams.y = Math.max(0, Math.min(buttonParams.y,
                                screenHeight - buttonSizePx));

                            try {
                                windowManager.updateViewLayout(buttonLayout, buttonParams);
                            } catch (Exception e) {
                                Log.e(TAG, "Failed to update button layout", e);
                            }
                        }
                        return true;

                    case MotionEvent.ACTION_UP:
                        if (!isDragging && System.currentTimeMillis() - touchStartTime < 300) {
                            // Tap - toggle menu
                            toggleMenu();
                        } else if (isDragging) {
                            // Snap to nearest edge
                            int snapX = buttonParams.x < screenWidth / 2
                                ? dpToPx(16)
                                : screenWidth - buttonSizePx - dpToPx(16);
                            buttonParams.x = snapX;

                            try {
                                windowManager.updateViewLayout(buttonLayout, buttonParams);
                            } catch (Exception e) {
                                Log.e(TAG, "Failed to snap button", e);
                            }
                        }
                        isDragging = false;
                        return true;
                }
                return false;
            }
        });

        try {
            windowManager.addView(buttonLayout, buttonParams);
            floatingButton = buttonLayout;
        } catch (Exception e) {
            Log.e(TAG, "Failed to add floating button", e);
        }
    }

    /**
     * Toggle the floating menu visibility
     */
    private void toggleMenu() {
        if (isMenuVisible) {
            hideMenu();
        } else {
            showMenu();
        }
    }

    /**
     * Show the message menu above the floating button
     */
    private void showMenu() {
        if (floatingMenu != null) {
            hideMenu();
        }

        int menuWidthPx = dpToPx(MENU_WIDTH_DP);
        int maxMenuHeight = (int) (screenHeight * 0.5);

        // Build menu layout
        LinearLayout menuLayout = new LinearLayout(this);
        menuLayout.setOrientation(LinearLayout.VERTICAL);

        GradientDrawable menuBg = new GradientDrawable();
        menuBg.setCornerRadius(dpToPx(16));
        menuBg.setColor(Color.parseColor("#1A1F2E"));
        menuBg.setStroke(dpToPx(2), Color.parseColor("#FF6B35"));
        menuLayout.setBackground(menuBg);
        menuLayout.setElevation(dpToPx(12));
        menuLayout.setPadding(dpToPx(8), dpToPx(8), dpToPx(8), dpToPx(8));

        // Header
        TextView header = new TextView(this);
        header.setText("🏍 Quick Send");
        header.setTextColor(Color.WHITE);
        header.setTextSize(14);
        header.setPadding(dpToPx(12), dpToPx(8), dpToPx(12), dpToPx(8));
        header.setTypeface(null, android.graphics.Typeface.BOLD);
        menuLayout.addView(header);

        // Divider
        View divider = new View(this);
        divider.setBackgroundColor(Color.parseColor("#30363D"));
        LinearLayout.LayoutParams dividerParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(1));
        dividerParams.setMargins(0, dpToPx(4), 0, dpToPx(4));
        menuLayout.addView(divider, dividerParams);

        // Scrollable message list
        ScrollView scrollView = new ScrollView(this);
        LinearLayout messageList = new LinearLayout(this);
        messageList.setOrientation(LinearLayout.VERTICAL);
        messageList.setPadding(0, dpToPx(4), 0, dpToPx(4));

        for (final MessageData msg : messages) {
            LinearLayout msgRow = createMessageRow(msg);
            messageList.addView(msgRow);
        }

        scrollView.addView(messageList);
        LinearLayout.LayoutParams scrollParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        scrollParams.weight = 1;
        menuLayout.addView(scrollView, scrollParams);

        // Edit button
        View divider2 = new View(this);
        divider2.setBackgroundColor(Color.parseColor("#30363D"));
        LinearLayout.LayoutParams divider2Params = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(1));
        divider2Params.setMargins(0, dpToPx(4), 0, dpToPx(4));
        menuLayout.addView(divider2, divider2Params);

        TextView editBtn = new TextView(this);
        editBtn.setText("✏️ Edit Messages");
        editBtn.setTextColor(Color.parseColor("#FF6B35"));
        editBtn.setTextSize(13);
        editBtn.setGravity(Gravity.CENTER);
        editBtn.setPadding(dpToPx(12), dpToPx(10), dpToPx(12), dpToPx(10));
        editBtn.setTypeface(null, android.graphics.Typeface.BOLD);
        editBtn.setOnClickListener(v -> {
            // Launch the main React Native activity
            hideMenu();
            Intent launchIntent = getPackageManager()
                .getLaunchIntentForPackage(getPackageName());
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(launchIntent);
            }
        });
        menuLayout.addView(editBtn);

        // Position menu above the button
        int overlayType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            : WindowManager.LayoutParams.TYPE_PHONE;

        menuParams = new WindowManager.LayoutParams(
            menuWidthPx,
            WindowManager.LayoutParams.WRAP_CONTENT,
            overlayType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        );

        menuParams.gravity = Gravity.TOP | Gravity.START;
        // Position to the left of button if button is on right side
        if (buttonParams.x > screenWidth / 2) {
            menuParams.x = buttonParams.x - menuWidthPx + dpToPx(BUTTON_SIZE_DP);
        } else {
            menuParams.x = buttonParams.x;
        }
        // Position above the button
        menuParams.y = Math.max(dpToPx(50),
            buttonParams.y - dpToPx(300)); // Approximate menu height

        try {
            windowManager.addView(menuLayout, menuParams);
            floatingMenu = menuLayout;
            isMenuVisible = true;
        } catch (Exception e) {
            Log.e(TAG, "Failed to show menu", e);
        }
    }

    /**
     * Create a single message row for the floating menu
     */
    private LinearLayout createMessageRow(final MessageData msg) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(dpToPx(8), dpToPx(6), dpToPx(8), dpToPx(6));

        GradientDrawable rowBg = new GradientDrawable();
        rowBg.setCornerRadius(dpToPx(12));
        rowBg.setColor(Color.parseColor("#161B22"));
        row.setBackground(rowBg);

        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        rowParams.setMargins(0, dpToPx(3), 0, dpToPx(3));
        row.setLayoutParams(rowParams);

        // Colored icon circle
        TextView iconView = new TextView(this);
        iconView.setText(getEmojiForIcon(msg.icon));
        iconView.setTextSize(20);
        iconView.setGravity(Gravity.CENTER);

        GradientDrawable iconBg = new GradientDrawable();
        iconBg.setCornerRadius(dpToPx(12));
        try {
            iconBg.setColor(Color.parseColor(msg.color));
        } catch (Exception e) {
            iconBg.setColor(Color.parseColor("#FF6B35"));
        }
        iconView.setBackground(iconBg);

        LinearLayout.LayoutParams iconParams = new LinearLayout.LayoutParams(
            dpToPx(42), dpToPx(42));
        iconParams.setMargins(0, 0, dpToPx(10), 0);
        row.addView(iconView, iconParams);

        // Message text
        TextView textView = new TextView(this);
        textView.setText(msg.text);
        textView.setTextColor(Color.WHITE);
        textView.setTextSize(13);
        textView.setTypeface(null, android.graphics.Typeface.BOLD);
        textView.setMaxLines(1);

        LinearLayout.LayoutParams textParams = new LinearLayout.LayoutParams(
            0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        row.addView(textView, textParams);

        // Tap to send
        row.setOnClickListener(v -> {
            sendMessageFromOverlay(msg);
            // Flash feedback
            GradientDrawable flashBg = new GradientDrawable();
            flashBg.setCornerRadius(dpToPx(12));
            flashBg.setColor(Color.parseColor("#27AE60"));
            row.setBackground(flashBg);

            row.postDelayed(() -> {
                GradientDrawable normalBg = new GradientDrawable();
                normalBg.setCornerRadius(dpToPx(12));
                normalBg.setColor(Color.parseColor("#161B22"));
                row.setBackground(normalBg);
            }, 500);
        });

        return row;
    }

    /**
     * Map Material Community Icon names to emoji approximations
     * (In a full implementation, you'd use a proper icon font or drawable)
     */
    private String getEmojiForIcon(String iconName) {
        switch (iconName) {
            case "car-brake-alert": return "🛑";
            case "gas-station": return "⛽";
            case "map-marker-alert": return "📍";
            case "coffee": return "☕";
            case "speedometer": return "💨";
            case "speedometer-slow": return "🐌";
            case "alert-octagon": return "🚨";
            case "hand-back-left": return "✋";
            case "motorbike": return "🏍";
            case "navigation": return "🧭";
            case "food": return "🍔";
            case "wrench": return "🔧";
            case "camera": return "📷";
            case "phone": return "📞";
            case "thumb-up": return "👍";
            case "flag-checkered": return "🏁";
            case "weather-rainy": return "🌧";
            case "home": return "🏠";
            default: return "📢";
        }
    }

    /**
     * Send a message from the floating overlay
     */
    private void sendMessageFromOverlay(MessageData msg) {
        // Show toast confirmation
        Toast.makeText(this,
            "Sent: " + msg.text,
            Toast.LENGTH_SHORT).show();

        // In production, this would:
        // 1. Send via FCM/WebSocket
        // 2. Broadcast to React Native via Intent/Event
        // 3. Update message stats

        // Broadcast to React Native
        Intent intent = new Intent("com.bikemessenger.MESSAGE_SENT");
        intent.putExtra("messageId", msg.id);
        intent.putExtra("messageText", msg.text);
        intent.putExtra("timestamp", System.currentTimeMillis());
        sendBroadcast(intent);

        Log.i(TAG, "Message sent from overlay: " + msg.text);
    }

    /**
     * Hide the floating menu
     */
    private void hideMenu() {
        if (floatingMenu != null) {
            try {
                windowManager.removeView(floatingMenu);
            } catch (Exception e) {
                Log.e(TAG, "Failed to remove menu", e);
            }
            floatingMenu = null;
            isMenuVisible = false;
        }
    }

    /**
     * Update menu content with new messages
     */
    private void updateMenuContent() {
        if (isMenuVisible) {
            hideMenu();
            showMenu();
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        hideMenu();
        if (floatingButton != null) {
            try {
                windowManager.removeView(floatingButton);
            } catch (Exception e) {
                Log.e(TAG, "Failed to remove floating button", e);
            }
            floatingButton = null;
        }
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }
}
