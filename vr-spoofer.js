/**
 * @name VRPlatformSpoofer
 * @description Injects structural changes locally inside Kettu to register the native green VR status indicator badge.
 * @author Sovereign
 * @version 1.0.0
 */

export default {
    onStart() {
        try {
            // Overrides client handshake properties dynamically before connection auth
            Object.defineProperty(navigator, 'userAgent', {
                get: () => 'Discord VR/1.0 (Android; Meta Quest 3)',
                configurable: true
            });
            
            if (window.DiscordNative) {
                window.DiscordNative.process.platform = 'vr';
            }
            console.log("[VR-Spoofer] Injected successfully.");
        } catch (e) {
            console.error("[VR-Spoofer] Failed initialization:", e);
        }
    },
    onStop() {
        console.log("[VR-Spoofer] Disabled.");
    }
};
