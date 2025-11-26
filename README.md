## Passify

All your bar / qr code passes in one handy app.

---

### Local development

- Install the ionic cli: `npm install -g @ionic/cli` 
- After running `npm install` you'll be able to preview your app in the browser by running `ionic serve`

### Previewing on mobile device

- Install Android Studio and run it
- `ionic build`
- `npx cap sync android`
- In Android Studio you can now select a device and hit the 'Run App' icon in the top bar

### Developing with live reload on mobile device

- Ensure that the `JAVA_HOME` environment variable is set on your machine and points to
  an installation of Java Development Kit (JDK). If you have Android Studio installed, you
  can point to their JDK installation (`C:\Program Files\Android\Android Studio\jbr` by default)
- Connect your device to your computer (USB cable is easiest, but Wi-Fi might work, too)
- `ionic cap run android -l --external`
- Now you can see your changes live on both your device AND your browser!