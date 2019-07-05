package org.autodevicegrid.selenium.matcher;

import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.HashMap;

public class AppiumCapabilityMatcherTest {
    AppiumCapabilityMatcher matcher = new AppiumCapabilityMatcher();

    static final String PLATFORM_NAME = "platformName";
    static final String UDID = "udid";

    @Test
    public void testUdid() {
        HashMap<String, Object> requestedCaps = new HashMap<String, Object>();
        HashMap<String, Object> nodeCaps = new HashMap<String, Object>();
        requestedCaps.put(UDID, "testUdid");
        nodeCaps.put(UDID, "testUdid");
        Assert.assertTrue(matcher.matches(nodeCaps, requestedCaps));
    }

    @Test
    public void testUdidNotPresent() {
        HashMap<String, Object> requestedCaps = new HashMap<String, Object>();
        HashMap<String, Object> nodeCaps = new HashMap<String, Object>();
        requestedCaps.put(PLATFORM_NAME, "testUdid");
        nodeCaps.put(PLATFORM_NAME, "test");
        Assert.assertFalse(matcher.matches(nodeCaps, requestedCaps));
    }

    @Test
    public void testPlatformName() {
        HashMap<String, Object> requestedCaps = new HashMap<String, Object>();
        HashMap<String, Object> nodeCaps = new HashMap<String, Object>();
        requestedCaps.put(PLATFORM_NAME, "testPlatform");
        nodeCaps.put(PLATFORM_NAME, "testPlatform");
        Assert.assertTrue(matcher.matches(nodeCaps, requestedCaps));
    }

    @Test
    public void testPlatformNameNotPresent() {
        HashMap<String, Object> requestedCaps = new HashMap<String, Object>();
        HashMap<String, Object> nodeCaps = new HashMap<String, Object>();
        requestedCaps.put(PLATFORM_NAME, "testPlatform");
        nodeCaps.put(PLATFORM_NAME, "test");
        Assert.assertFalse(matcher.matches(nodeCaps, requestedCaps));
    }

    @Test
    public void testPlatformAndUdidPresent() {
        HashMap<String, Object> requestedCaps = new HashMap<String, Object>();
        HashMap<String, Object> nodeCaps = new HashMap<String, Object>();
        requestedCaps.put(PLATFORM_NAME, "testPlatform");
        requestedCaps.put(UDID, "testUdid");
        nodeCaps.put(PLATFORM_NAME, "testPlatform");
        nodeCaps.put(UDID, "testUdid");
        Assert.assertTrue(matcher.matches(nodeCaps, requestedCaps));
    }

    @Test
    public void testPlatformAndUdidNotPresent() {
        HashMap<String, Object> requestedCaps = new HashMap<String, Object>();
        HashMap<String, Object> nodeCaps = new HashMap<String, Object>();
        requestedCaps.put(PLATFORM_NAME, "testPlatform");
        requestedCaps.put(UDID, "testUdid");
        nodeCaps.put(PLATFORM_NAME, "testPlatform1");
        nodeCaps.put(UDID, "testUdid1");
        Assert.assertFalse(matcher.matches(nodeCaps, requestedCaps));
    }
}
