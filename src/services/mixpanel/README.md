# Mixpanel Integration with Server-Side Tracking

This document outlines the implementation of Mixpanel tracking in our application, focusing on the migration from the client-side `mixpanel-browser` library to a server-side approach using `mixpanel-node`. The goal is to maintain the same level of data collection and analytics while addressing any limitations of client-side tracking.

## Table of Contents

- [Mixpanel Integration with Server-Side Tracking](#mixpanel-integration-with-server-side-tracking)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Migration Overview](#migration-overview)
  - [MixpanelService Class](#mixpanelservice-class)
    - [Initialization](#initialization)
    - [Geolocation](#geolocation)
    - [Managing User Sessions](#managing-user-sessions)
    - [Tracking Page Views and Events](#tracking-page-views-and-events)
    - [Handling Super Properties](#handling-super-properties)
    - [Resetting the Session](#resetting-the-session)
  - [Server-Side Mixpanel API Endpoint](#server-side-mixpanel-api-endpoint)
  - [Ensuring Data Consistency](#ensuring-data-consistency)
  - [Testing and Verification](#testing-and-verification)
  - [References](#references)
  - [Future Improvements](#future-improvements)
  - [Important Mixpanel Notes from Mixpanel Support Team](#important-mixpanel-notes-from-mixpanel-support-team)
    - [How to contact Mixpanel Support](#how-to-contact-mixpanel-support)
    - [How to work with mixpanel](#how-to-work-with-mixpanel)

## Introduction

We have transitioned from using the client-side `mixpanel-browser` library to a server-side implementation using `mixpanel-node`. This change addresses concerns with client-side dependencies (basically to avoid adblockers which were blocking useful data) and aims to provide more control over the data sent to Mixpanel. This document explains how the new implementation works and how it maintains data consistency with the previous setup.

## Migration Overview

The migration involved:

-   Replacing `mixpanel-browser` with `mixpanel-node` for server-side tracking.
-   Updating the `MixpanelService` class to manage Mixpanel interactions.
-   Implementing a server-side API route (`/api/mixpanel`) to handle event tracking requests.
-   Manually collecting metadata that was previously auto-collected by `mixpanel-browser`.
-   Ensuring that the data sent to Mixpanel remains consistent with the previous implementation.

## MixpanelService Class

The `MixpanelService` class is a singleton responsible for:

-   Initializing Mixpanel tracking.
-   Managing user sessions.
-   Tracking page views and custom events.
-   Handling super properties and user identification.
-   Sending events to the server-side API endpoint.
-   Resetting the session.
-   Identifying users.
-   Setting people properties.

### Initialization

The `initialize()` method sets up the Mixpanel tracking environment:

-   Generates a new `deviceId` using `uuidv4()` if none exists.
-   Stores the `deviceId` in a cookie for session persistence.
-   Sets up super properties.

### Geolocation

-   As we are using the `mixpanel-node` library, we need to manually add the `ip` to the events properties. And for this we also need to set the `geolocate` property to `false` when initializing the `mixpanel-node` instance in prod environments (development is set to `true` by default as locally the app doesn't work behind cloudflare). Then, we need the `ip` of the client from cloudflare headers, currently from the `cf-connecting-ip` header and finally pass the `ip` to each dispatched event. With this `ip` mixpanel will be able to geolocate the user parsing city, country, region and so on. If the `geolocate` property is set to true, mixpanel use the `ip` of the cloudflare server instead of the client's `ip` and all the events will be geolocated to the cloudflare server's ip (Ashburn, VA).

### Managing User Sessions

-   **Cookies**: Store `deviceId` and super properties to persist user data.
-   **Reset**: Resets the session, generating a new `deviceId`.
-   **Identify**: Associates the UnicityId of the user with mixpanel `$user_id`.

### Tracking Page Views and Events

-   **trackPageView()**: Tracks page views with relevant properties.
-   **trackEvent()**: Tracks custom events with the properties we have in the event and attach to it the registered super properties.

### Handling Super Properties

-   **registerSuperProperties()**: Registers properties that are sent with every event.
-   **initializeSuperProperties()**: Sets default super properties like `unicity_product`, `user_market`, and `user_language`.

### Resetting the Session

-   **reset()**: Resets the tracking session, generating a new `deviceId` and setting the `userId` to null.

## Server-Side Mixpanel API Endpoint

We have an API route at `/api/mixpanel` that handles event tracking requests:

-   Creates a new Mixpanel instance and sends the event to Mixpanel using `mixpanel-node`.
-   Receives event data from the client-side `MixpanelService`.

## Ensuring Data Consistency

To maintain consistency with the previous `mixpanel-browser` implementation:

-   **Manual Data Collection**: We collect all the metadata that was previously auto-collected.
-   **Event Properties**: All events include the same properties as before, allowing Mixpanel dashboards to remain accurate.
-   **Super Properties**: As now we are using `mixpanel-node`, we don't have the concept of super properties, so we need to manually add the super properties to every event.
-   **People Properties**: We are using the `setPeopleProperties` method to set people properties. Some extra metadata is added to the people properties, like the os, browser, browser version, device and initial referrer and the initial referring domain.
-   **Note**: some properties which before were auto-collected, like browser, os, referrer or utm parameters, we need to manually add them to the events properties at the `/api/mixpanel` endpoint as they suggest in the [server side best practices section](https://docs.mixpanel.com/docs/tracking-best-practices/server-side-best-practices).

## Testing and Verification

-   **Live View in Mixpanel**: Use Mixpanel's Live View to verify that events are arriving with the correct properties.
-   **Tests**: Ensure that the `MixpanelService` class is tested, including some edge cases like uninitialized states. _It's still a work in progress._
-   **Error Handling and Logging**: Need to be improved.

## References

-   [Mixpanel Server-Side Best Practices](https://docs.mixpanel.com/docs/tracking-best-practices/server-side-best-practices)
-   [Mixpanel Identity Management](https://docs.mixpanel.com/docs/tracking-methods/id-management/identifying-users-simplified)
-   [Mixpanel Node.js SDK Documentation](https://docs.mixpanel.com/docs/tracking-methods/sdks/nodejs)

## Future Improvements

-   [x] Create an Enums file for the different types of events we are sending to Mixpanel
-   [ ] Create helper functions to build the events properties objects

## Important Mixpanel Notes from Mixpanel Support Team

As there are some contradictions in the Mixpanel docs, as we see below:

> distinct_id is optional on events because Mixpanel automatically updates or overrides it whenever $user_id or $device_id is present on the events. It takes the value of $user_id if present; otherwise, it takes $device_id and prefixes it with $device
> [from docs](https://docs.mixpanel.com/docs/tracking-methods/id-management/migrating-to-simplified-id-merge-system#understanding-simplified-id-merge)

vs

> The mixpanel.track() method takes two arguments, an event name and a properties object which must include the distinct_id.
> [from docs](https://docs.mixpanel.com/docs/tracking-methods/sdks/nodejs)

We ended up asking the Mixpanel support team about this and this was the response:

> Under the Simplified ID Merge system, you can handle session/identity merging by sending events that contain both $device_id and $user_id properties. That will trigger the merging of the anonymous user/session (represented by $device_id) with the authenticated user/session (represented by $user_id).
> Here's an example of how you might do this:

```typescript
const Mixpanel = require("mixpanel");
const mixpanel = Mixpanel.init("projtoken", {
    debug: true
});

mixpanel.track("pre-auth-event", {
    $device_id: "anon-id-uuid-v4-format"
    // distinct_id would be set by the SDK as "anon-id-uuid-v4-format"
});

mixpanel.track("post-auth-event", {
    $device_id: "anon-id-uuid-v4-format",
    user_id: "yourUserID"
    // distinct_id would be set by the SDK as "yourUserID"
});
```

In the example above, anon-id-uuid-v4-format is the ID for the anonymous user, and yourUserID is the ID for the identified user. The post-auth-event merges the anonymous and identified IDs into a single identity cluster, with yourUserID as the canonical distinct_id.

As for your query on super properties, our Node.js SDK is a server-side library which does not maintain user state internally and so has no concept of super properties. Therefore, if you wish to persist properties for users between requests, you would need to include them in each request explicitly - they would essentially be treated the same way as normal event properties.

### How to contact Mixpanel Support

At mixpanel dashboard, you have the option to contact support team at: help (has a question mark icon) => contact support (at main navbar).

### How to work with mixpanel

-   Read the docs related to the feature you want to use
-   Before implementing it, go to the repo https://github.com/mixpanel/mixpanel-node/blob/261a98b929e7c2ce6c99d8169335fb06b86ff8d9/lib/mixpanel-node.js
