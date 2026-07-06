# Fairdeal Assets

Run locally with dynamic property slug support:

```bash
npm start
```

Open `http://localhost:3000/properties/sampark-heights-patia/`.

The dynamic property route is handled by `server.js`. Static hosting must be configured to rewrite `/properties/*` to `property.html`; for full SEO meta/schema per property, deploy the Node server or another server-side renderer.

For platforms that require binding to all interfaces, start with `HOST=0.0.0.0 npm start`.
