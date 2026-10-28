/**
 * @name VRPlatformSpoofer
 * @description Safely hooks internal client property arrays to trigger the official VR headset status badge natively.
 * @author Sovereign
 * @version 1.1.0
 */

import { webpack } from "@vendetta/modules";

let cleanupPatch;

export default {
    onStart() {
        try {
            // Locates the underlying super property tracking module in the mobile client registry
            const SuperPropertiesModule = webpack.findByProps("getSuperProperties");
            
            if (SuperPropertiesModule && SuperPropertiesModule.getSuperProperties) {
                const originalMethod = SuperPropertiesModule.getSuperProperties;
                
                // Intercepts outbound device payloads dynamically
                SuperPropertiesModule.getSuperProperties = function(...args) {
                    const superProps = originalMethod.apply(this, args);
                    superProps.os = "android";
                    superProps.browser = "Discord VR";
                    superProps.device = "Discord VR";
                    return superProps;
                };

                // Defines a clean exit vector to restore defaults safely if toggled off
                cleanupPatch = () => {
                    SuperPropertiesModule.getSuperProperties = originalMethod;
                };
                
                console.log("[VR-Spoofer] Target modules successfully patched.");
            } else {
                console.error("[VR-Spoofer] Could not locate property parameters in registry mapping.");
            }
        } catch (error) {
            console.error("[VR-Spoofer] Ingestion phase failed:", error);
        }
    },
    
    onStop() {
        if (cleanupPatch) {
            cleanupPatch();
            console.log("[VR-Spoofer] Removed client hooks safely.");
        }
    }
};
