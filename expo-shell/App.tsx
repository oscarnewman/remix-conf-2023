import { StatusBar } from "expo-status-bar";
import React, { RefObject, useEffect } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
// import { SafeAreaView } from "react-native-safe-area-context";

export function useHandleBack(webRef: RefObject<WebView>) {
  useEffect(() => {
    const handleHardwareBackPress = () =>
      (webRef.current?.goBack() ?? true) || undefined;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwareBackPress
    );
    return () => subscription.remove();
  }, [webRef]);
}

export default function App() {
  const webRef = React.useRef<WebView>(null);

  useHandleBack(webRef);
  return (
    <View style={styles.container}>
      <WebView
        style={styles.webView}
        source={{ uri: "http://localhost:3000" }}
        decelerationRate="normal"
        allowsBackForwardNavigationGestures
        automaticallyAdjustsScrollIndicatorInsets
        androidLayerType="hardware"
        ref={webRef}
        onRenderProcessGone={() => webRef.current?.reload()}
        onContentProcessDidTerminate={() => webRef.current?.reload()}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    width: "100%",
    height: "100%",
  },
});
