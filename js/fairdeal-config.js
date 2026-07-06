(function () {
  window.FD_PROPERTY_LISTINGS_API_URL =
    window.FD_PROPERTY_LISTINGS_API_URL ||
    "https://script.google.com/macros/s/AKfycbwusi8eVx2al27flPBa2WccbHAhIFZr9UJiKXxlpZJJN6hWdrUIc8Ekfd_5b3liUUBqFQ/exec";
  window.FD_PROPERTY_DETAIL_BASE_PATH =
    window.FD_PROPERTY_DETAIL_BASE_PATH || "/properties/";
  var imageBase = "images/property/chatgpt/";
  window.FD_PROPERTY_IMAGE_OVERRIDES = window.FD_PROPERTY_IMAGE_OVERRIDES || {
    "sampark-heights-patia": {
      imageUrl: imageBase + "aerial-plotted-development.png",
      galleryUrls: [
        imageBase + "aerial-plotted-development.png",
        imageBase + "revenue-road-development.png",
        imageBase + "morning-suburban-plot.png",
        imageBase + "legal-land-deed.png"
      ]
    },
    "utkal-corporate-center": {
      imageUrl: imageBase + "patia-infocity-commercial-plot.png",
      galleryUrls: [
        imageBase + "patia-infocity-commercial-plot.png",
        imageBase + "zoning-plan-layout.png",
        imageBase + "industrial-landscape-survey.png",
        imageBase + "legal-land-deed.png"
      ]
    },
    "coastal-vista-villas": {
      imageUrl: imageBase + "development-site-data.png",
      galleryUrls: [
        imageBase + "development-site-data.png",
        imageBase + "revenue-road-development.png",
        imageBase + "morning-suburban-plot.png",
        imageBase + "aerial-plotted-development.png"
      ]
    }
  };
})();
