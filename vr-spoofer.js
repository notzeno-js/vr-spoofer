/**
 * @name VRPlatformSpoofer
 * @description Injects structural changes locally inside Kettu to register the native green VR status indicator badge.
 * @author Sovereign
 * @version 1.0.0
 */

// We must import the plugin API utilities to find internal modules securely
import { webpack } from "@vendetta/modules";

let patch;

export default {
    onStart() {
        try {
            // Locate the internal properties module that Discord uses for the platform handshake
            const InfoModule = webpack.findByProps("getSuperProperties");
            
            if (InfoModule && InfoModule.getSuperProperties) {
                // Intercept the function to force the custom VR platform string pairs
                const originalGetSuperProperties = InfoModule.getSuperProperties;
                
                InfoModule.getSuperProperties = function(...args) {
                    const props = originalGetSuperProperties.apply(this, args);
                    props.os = "android";
                    props.browser = "Discord VR";
                    props.device = "Discord VR";
                    return props;
                };

                // Save a reference to revert changes safely if the plugin is turned off
                patch = () => {
                    InfoModule.getSuperProperties = originalGetSuperProperties;
                };
                
                console.log("[VR-Spoofer] Mobile gateway hooks applied successfully.");
            } else {
                console.error("[VR-Spoofer] InfoModule properties target not found.");
            }
        } catch (e) {
            console.error("[VR-Spoofer] Failed mobile initialization:", e);
        }
    },
    
    onStop() {
        if (patch) {
            patch();
            console.log("[VR-Spoofer] Disabled and hooks unpatched cleanly.");
        }
    }
};
