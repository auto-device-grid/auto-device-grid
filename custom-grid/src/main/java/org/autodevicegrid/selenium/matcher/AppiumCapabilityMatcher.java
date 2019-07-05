package org.autodevicegrid.selenium.matcher;

import org.openqa.grid.internal.utils.DefaultCapabilityMatcher;

import java.util.Map;

public class AppiumCapabilityMatcher extends DefaultCapabilityMatcher {
    @Override
    public boolean matches(Map<String, Object> nodeCaps, Map<String, Object> requestedCaps) {
        boolean matches = super.matches(nodeCaps, requestedCaps);
        String[] properties = { "platformName", "udid" };
        for(String property : properties) {
            if (requestedCaps.containsKey(property)) {
                matches = matches && nodeCaps.get(property).toString()
                    .equalsIgnoreCase(requestedCaps.get(property).toString());
            }
        }
        return matches;
    }
}
