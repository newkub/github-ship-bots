self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? "ship-feed", {
      body: data.body ?? "",
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      tag: data.tag ?? "ship-feed",
      data: { url: data.url ?? "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(self.clients.openWindow(url));
});
