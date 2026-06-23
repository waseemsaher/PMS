

---

# Pool Timer Manager

## Product Requirements Document (PRD)

**Version:** 1.0

**Status:** Draft → Approved for Development

**Platform:** Android (Offline First)

**Framework:** React Native + TypeScript

---

# 1. Executive Summary

Pool Timer Manager is a dedicated Android application designed to replace manual session tracking at a swimming pool reception.

The application enables staff to register customers, start and monitor swimming sessions, receive automatic expiration notifications, manage rentals and payments, calculate open-session charges, and maintain a complete historical archive.

The primary objective is to eliminate timing mistakes while providing an extremely fast workflow suitable for busy reception environments.

The application is designed for **real daily operation**, not as a demonstration or educational project.

---

# 2. Product Vision

Create the fastest and most reliable swimming pool session management application that can operate completely offline with minimal user interaction.

Every common operation should require as few taps as possible while maintaining complete accuracy.

The application should become the primary operational tool used by swimming pool reception staff throughout the working day.

---

# 3. Problem Statement

Currently, swimming pool sessions are often managed manually.

Common problems include:

- Forgetting customer end times.
    
- Incorrect payment calculations.
    
- Losing track of rentals.
    
- No historical records.
    
- Difficult monthly accounting.
    
- Human timing errors.
    
- No statistics.
    
- Slow customer registration.
    

These problems increase as customer volume grows.

---

# 4. Product Goals

The application must:

### G1

Register a customer in under **10 seconds**.

---

### G2

Accurately track unlimited simultaneous customer sessions.

---

### G3

Notify staff before sessions expire.

---

### G4

Provide reliable timing even if:

- Application closes
    
- Phone restarts
    
- Device sleeps
    
- Battery optimization occurs
    

---

### G5

Automatically archive completed sessions.

---

### G6

Generate daily and monthly statistics.

---

### G7

Work entirely offline.

---

### G8

Require almost zero training for new employees.

---

# 5. Success Metrics

The product is considered successful when:

- Customer registration <10 seconds.
    
- No timer inaccuracies.
    
- No lost history.
    
- Monthly reports match manual accounting.
    
- Reception staff can operate the app with one hand.
    
- Average interaction per customer remains minimal.
    

---

# 6. Target Users

## Primary User

Swimming Pool Reception Staff

Responsibilities:

- Register customers.
    
- Monitor active sessions.
    
- Receive expiration alerts.
    
- Record payments.
    
- Record rentals.
    
- Finish sessions.
    

---

## Secondary User

Swimming Pool Owner / Manager

Responsibilities:

- Review statistics.
    
- Review reports.
    
- Verify income.
    
- Monitor monthly performance.
    

---

# 7. Product Scope

Included in Version 1:

- Customer management
    
- Session timers
    
- Notifications
    
- Rentals
    
- Payments
    
- Search
    
- Dashboard
    
- History
    
- Statistics
    
- Local database
    
- Settings
    

---

# 8. Out of Scope (Version 1)

The following features are intentionally excluded:

- Online synchronization
    
- Cloud backup
    
- Multiple swimming pools
    
- Employee accounts
    
- Login system
    
- Customer phone numbers
    
- Customer reservations
    
- Membership system
    
- QR codes
    
- Barcode support
    
- Printing receipts
    
- Multi-language support
    
- iOS version
    

These may be considered for future releases.

---

# 9. Product Principles

The following principles guide every design decision:

## Simplicity First

The application must remain simple.

No unnecessary screens.

No unnecessary dialogs.

---

## Speed Over Decoration

Operations are prioritized over visual effects.

Animations should never delay the user.

---

## Offline First

Internet must never be required.

Every feature must function without network connectivity.

---

## Data Integrity

Customer data must never be lost.

History must remain accurate.

Timers must remain accurate.

---

## Reliability

The application must behave predictably under all normal conditions.

---

## Minimal User Input

Typing should be minimized.

Selections should replace text whenever possible.

---

# 10. Assumptions

The following assumptions are made:

- One Android phone is used.
    
- One swimming pool is managed.
    
- One global hourly price.
    
- Rental prices are mostly fixed.
    
- Customers may arrive simultaneously.
    
- Reception staff are not technical users.
    
- Sessions are independent.
    
- Every new visit creates a new session.
    

---

# 11. Constraints

The application must operate under these constraints:

- Android only.
    
- Offline only.
    
- Local storage only.
    
- No internet dependency.
    
- No backend.
    
- No subscriptions.
    
- No external services.
    

---

# 12. User Stories

### US-001

As a receptionist,

I want to register a customer quickly,

so I can avoid delaying customers.

---

### US-002

As a receptionist,

I want to know who finishes first,

so I don't forget anyone.

---

### US-003

As a receptionist,

I want the application to notify me before time expires,

so I can prepare for customer exit.

---

### US-004

As a receptionist,

I want expired customers to remain visible,

so I don't accidentally forget to finish their session.

---

### US-005

As a receptionist,

I want to extend a session,

so I don't need to create a new one.

---

### US-006

As a manager,

I want to review today's revenue,

so I know business performance.

---

### US-007

As a manager,

I want monthly reports,

so accounting becomes easy.

---

### US-008

As a receptionist,

I want customer history,

so I can verify previous sessions.

---

### US-009

As a receptionist,

I want payment status recorded,

so unpaid items are never forgotten.

---

### US-010

As a receptionist,

I want rental items tracked,

so every rented item is returned and charged correctly.

---

# 13. Product Vision Statement

> **"Pool Timer Manager should become the only application required by swimming pool reception staff to manage daily customer sessions quickly, accurately, and reliably without relying on internet connectivity."**



---

# PART 2 — Software Requirements Specification (SRS)

Version 1.0

---

# Functional Requirements

---

# FR-001 — Add Customer

## Description

The application shall allow the user to create a new swimming session in less than 10 seconds.

---

## Inputs

Required

- Customer Name
    
- Number of People
    
- Session Type
    

Optional

- Rentals
    
- Notes
    
- Payment Status
    

---

## Session Types

The application shall support four session types.

### Half Hour

30 Minutes

---

### One Hour

60 Minutes

---

### Custom Duration

User enters duration in minutes.

Minimum

5 Minutes

Maximum

12 Hours

---

### Open Session

No predefined end time.

Timer counts upward until manually finished.

---

## Validation Rules

Customer Name

- Required
    
- Maximum 50 characters
    
- Leading/trailing spaces removed
    

---

People Count

Minimum

1

Maximum

99

---

Duration

Must be greater than zero.

---

Session Type

Must always be selected.

---

## Business Rules

When customer is created:

Application shall automatically

- Generate unique Session ID
    
- Store current timestamp
    
- Calculate end timestamp (except Open Session)
    
- Save record locally
    
- Display customer immediately
    

---

## Success Result

Customer appears in Home Screen.

Timer starts immediately.

---

## Failure Cases

If required fields are missing

Display validation message.

No record created.

---

## Acceptance Criteria

✔ Customer appears instantly

✔ Timer starts

✔ Data survives application restart

---

# FR-002 — Edit Customer

## Description

Receptionist can edit an active customer.

---

Editable Fields

- Name
    
- People Count
    
- Payment Status
    
- Rentals
    
- Notes
    

---

Non Editable

Start Time

Session ID

---

Timer

Can only be changed through

Extend Session.

---

Acceptance

Changes saved instantly.

---

# FR-003 — Finish Session

## Description

Receptionist manually finishes customer.

---

System shall

Stop timer

Calculate duration

Calculate payment

Archive session

Remove active card

Refresh Dashboard

---

Undo

Application shall provide

Undo

for

5 seconds.

---

Acceptance

History updated.

Dashboard updated.

---

# FR-004 — Extend Session

## Description

Receptionist may extend session.

---

Quick Buttons

+30

+60

Custom

---

Business Rules

Extension starts from current end time.

Not current time.

---

Example

End

11:00

Press

+30

New End

11:30

---

Acceptance

Timer immediately updates.

---

# FR-005 — Search Customer

Realtime Search.

Search by

Name only.

Case insensitive.

Instant filtering.

---

# FR-006 — Customer Sorting

Default sorting

1

Expired

2

Less than five minutes

3

Remaining time ascending

---

Manual sorting not required.

---

# FR-007 — Customer Card

Every active customer card shall display

Customer Name

People Count

Remaining Time

Payment Status

Rental Summary

Buttons

Edit

Finish

Extend

---

Card States

Normal

Yellow

Red

---

Yellow

Remaining <= 5 minutes

---

Red

Expired

---

# FR-008 — Notification System

Application shall generate

Local Notifications.

---

Trigger

Session expires.

---

Notification

Sound

Vibration

Android Notification

---

Application closed

Still notify.

---

Multiple customers

Grouped notification.

---

# FR-009 — Timer Engine

The timer system shall never rely on screen refresh.

Timers shall use

Stored timestamps.

Remaining Time

End Timestamp

Current Timestamp

---

Must survive

Application close

Phone restart

Sleep mode

Background mode

---

No timer drift allowed.

---

# FR-010 — Payment System

Every session has

Payment Status

Paid

Partial

Unpaid

---

Payment Items

Session

Board

Shorts

Deposit

Custom Items

---

Prices loaded from Settings.

---

# FR-011 — Rental Items

Default

Board

Shorts

Deposit

---

Support

Custom Rental Items.

---

Every item contains

Name

Price

Paid Status

---

# FR-012 — Open Session

No End Time.

---

Timer counts upward.

---

Finish

Calculate

Elapsed Time

Convert to price

Round according to pricing rules.

---

# FR-013 — Dashboard

Dashboard shall display

Today's Revenue

Monthly Revenue

Lifetime Revenue

Today's Customers

Monthly Customers

Lifetime Customers

Currently Active

Expired Sessions

Near Expiration

---

Updates automatically.

---

# FR-014 — History

Every finished session archived permanently.

---

Fields

Session ID

Customer Name

People Count

Session Type

Start

End

Duration

Rentals

Payment

Notes

Total

---

Filters

Today

Yesterday

Week

Month

Custom

---

Search

Customer Name

---

# FR-015 — Settings

Settings shall allow

Hour Price

Rental Prices

Warning Minutes

Notification Sound

Vibration

---

Changes affect

Future Sessions only.

---

# FR-016 — Offline Mode

Entire application shall function

Without Internet.

---

No cloud services.

---

No login.

---

No backend.

---

# FR-017 — Data Persistence

All data stored locally.

Application restart

Must restore

Settings

Active Sessions

History

Dashboard

---

# FR-018 — Performance

Home Screen

Load

< 1 second

---

Search

< 100 ms

---

Timer Updates

Smooth

---

Support

5000+

History Records

---

# FR-019 — Error Handling

Prevent

Duplicate crashes.

Invalid durations.

Missing settings.

Corrupted local storage.

---

Show friendly messages.

Never lose customer data.

---

# FR-020 — APK Release

Production Build

Release Mode

No Debug Logs

No TODO

No Mock Data

Ready for installation.

---

# PART 3 — Screen Specifications (UI / UX Specification)

---

# General UI Principles

## Design Philosophy

The application is designed for **speed**, not decoration.

The receptionist should be able to complete almost every operation using one hand.

Every screen must minimize taps, scrolling, and typing.

---

## Theme

Style

Modern Minimal

Primary Color

Blue

Success

Green

Warning

Yellow

Expired

Red

Background

Light Gray

Cards

White

---

## Typography

Primary Font

System Font

Headers

Bold

Body

Regular

Large buttons

Minimum height 48dp

---

## Navigation Structure

```
Splash

↓

Home

├── Add Customer
├── Edit Customer
├── Dashboard
├── History
└── Settings
```

Navigation Type

Bottom Navigation

```
🏠 Home

📊 Dashboard

📜 History

⚙ Settings
```

Floating Action Button

➕

Always visible on Home.

---

# Screen 1 — Splash Screen

Purpose

Initialize application.

---

Tasks

Load Settings

Load Active Sessions

Restore Timers

Initialize Notifications

Navigate Home

---

Maximum Loading Time

2 Seconds

---

If Database Error

Show

```
Unable to load data.

Retry
```

---

# Screen 2 — Home Screen

Purpose

Primary working screen.

Receptionist spends 95% of the day here.

---

Layout

```
------------------------------------

Pool Timer

------------------------------------

Summary Cards

------------------------------------

Search

------------------------------------

Customer List

------------------------------------

Floating Add Button

------------------------------------
```

---

## Summary Cards

Card 1

```
Active Customers

12
```

---

Card 2

```
Expired

2
```

---

Card 3

```
Less than 5 Minutes

1
```

---

Cards update automatically.

---

## Search Bar

Placeholder

```
Search customer...
```

Search by

Name

Realtime.

---

## Customer List

Sorting

1

Expired

↓

2

Less than Five Minutes

↓

3

Nearest Finish Time

---

Scrolling

Vertical

Infinite

---

Empty State

```
No Active Customers

Press +

to add one.
```

---

# Customer Card

Height

Approximately 140dp

Rounded Corners

16dp

Shadow

Small

---

Layout

```
--------------------------------

👤 Ahmed

👥 4 Persons

⏰ 00:18:22

💰 Paid

🏄 Board

🩳 Shorts

--------------------------------

Edit

Extend

Finish

--------------------------------
```

---

## Card Colors

Normal

White

---

Warning

Yellow Background

Remaining

<=5 Minutes

---

Expired

Light Red Background

---

Open Session

Display

```
Elapsed

01:24:12
```

Instead of

Remaining.

---

# Card Actions

Edit

↓

Open Edit Screen

---

Extend

↓

Bottom Sheet

```
+30 Minutes

+60 Minutes

Custom
```

---

Finish

↓

Finish Dialog

---

Long Press

Quick Menu

```
Edit

Extend

Finish
```

---

# Screen 3 — Add Customer

Purpose

Fast registration.

Target Time

<10 Seconds

---

Layout

```
Name

__________________

People

[-] 2 [+]

-------------------

Session Type

○ Half Hour

○ One Hour

○ Custom

○ Open

-------------------

If Custom

Minutes

_________

-------------------

Payment

Paid

Partial

Unpaid

-------------------

Rentals

☐ Board

☐ Shorts

☐ Deposit

-------------------

Notes

_________________

-------------------

SAVE
```

---

Validation

Name Required

People ≥1

Duration >0

---

Success

Automatically return

Home

---

# Screen 4 — Edit Customer

Same layout

As Add Customer

Except

Timer cannot be edited directly.

Only

Extend.

---

# Finish Dialog

```
Finish Session?

Ahmed

Duration

01:00

Total

150 EGP

[Cancel]

[Finish]
```

---

Undo Snackbar

```
Customer Finished

UNDO
```

Duration

5 Seconds

---

# Screen 5 — Dashboard

Purpose

Business Overview

---

Layout

```
Revenue Today

Revenue Month

Revenue Total

-------------------

Customers Today

Customers Month

Customers Total

-------------------

Current Active

Expired

Near Expiration

```

---

Charts

Version 1

No Charts

Numbers Only

---

Future

Charts

Version 2

---

# Screen 6 — History

Purpose

Permanent Archive

---

Top Filters

```
Today

Yesterday

Week

Month

Custom
```

---

Search

Customer Name

---

History Card

```
Ahmed

1 Hour

Paid

Board

150 EGP

11:00

↓

12:00
```

---

Tap Card

Open Details

---

History Details

Display

Everything

Including

Notes

Rentals

Payment

Session Type

Duration

---

# Screen 7 — Settings

Layout

```
Hour Price

120

------------------

Board Price

20

------------------

Shorts Price

30

------------------

Deposit Price

50

------------------

Warning Minutes

5

------------------

Notification Sound

ON

------------------

Vibration

ON
```

---

Buttons

Save

Reset Defaults

---

Validation

Prices

≥0

Warning

1–30 Minutes

---

# Global Dialogs

Delete Confirmation

Future Feature

---

Finish Confirmation

Yes

No

---

Validation Dialog

Invalid Input

---

Notification

Customer Time Finished

---

# Animations

Required

Very Small

---

Screen Transition

200ms

---

Button Ripple

Enabled

---

No Fancy Animations

---

# Responsive Rules

Must support

Small Phones

Large Phones

Landscape

Portrait

---

Minimum Width

320dp

---

# Accessibility

Large Touch Areas

Readable Fonts

Good Contrast

No Tiny Buttons

---
ممتاز، هنكمل بنفس المستوى.

---

# PART 3 — Screen Specification & UI/UX Design Document

**Version:** 1.0

---

# Design Philosophy

The application is designed for **speed**, **clarity**, and **one-handed operation**.

The receptionist should never spend time navigating between many screens.

Every common operation should be accessible within one or two taps.

The application must remain responsive even with thousands of history records.

---

# Global Design Rules

## Theme

- Modern Material Design 3
    
- Clean interface
    
- Rounded cards
    
- Soft shadows
    
- High contrast
    
- Large touch targets
    

---

## Primary Color

Swimming Pool Blue

Used for

- Primary Buttons
    
- Active Timer
    
- Toolbar
    

---

## Warning Color

Yellow

Used only when

Remaining Time <= Warning Time

(Default 5 minutes)

---

## Danger Color

Red

Used only after session expiration.

---

## Success Color

Green

Used for

Paid Status

Completed Operations

---

## Typography

Large titles

Medium subtitles

Readable timer font

Large button labels

---

## Icons

Every important action must have an icon.

Examples

➕

Add Customer

✏

Edit

⏱

Timer

💰

Payment

📦

Rentals

📊

Dashboard

📜

History

⚙

Settings

---

# Navigation Structure

Application contains seven screens.

```
Splash

↓

Home

├── Add Customer

├── Edit Customer

├── Dashboard

├── History

└── Settings
```

No deep navigation.

Maximum navigation depth

2

---

# Screen 1 — Splash Screen

## Purpose

Initialize application.

Load settings.

Restore active timers.

Load local database.

Navigate automatically.

---

## Duration

Maximum

2 seconds

---

## UI

Centered logo

Application Name

Loading indicator

---

## Background

Solid primary color.

---

## User Interaction

None.

---

# Screen 2 — Home Screen

This is the primary working screen.

Reception staff spends almost entire day here.

---

## App Bar

Contains

Application Name

Search Icon

Dashboard Icon

Settings Icon

---

## Summary Section

Three cards.

Card 1

Active Customers

Card 2

Expiring Soon

Card 3

Expired Sessions

These values update automatically.

---

## Search

Located below summary.

Placeholder

```
Search customer...
```

Realtime search.

Case insensitive.

---

## Customer List

Scrollable vertically.

Cards sorted automatically.

Priority

Expired

↓

Expiring Soon

↓

Nearest Finish Time

↓

Others

---

# Customer Card

Each card displays

---

Customer Name

Large bold text.

---

People Count

Example

```
👥 4
```

---

Session Type

30 Minutes

60 Minutes

Custom

Open

---

Timer

If Fixed Session

Remaining Time

```
00:24:31
```

If Open Session

Elapsed Time

```
01:42:15
```

---

Payment Status

Badge

Paid

Partial

Unpaid

---

Rentals

Small chips.

Example

Board

Shorts

Deposit

---

Action Buttons

Edit

Extend

Finish

---

Card Colors

Normal

White

Warning

Yellow

Expired

Red

---

Animations

Cards should never jump.

Only smooth updates.

---

Floating Action Button

Bottom Right

Large

Blue

Add Customer

---

# Screen 3 — Add Customer

Purpose

Create new session.

---

Layout

Scrollable form.

---

Fields

Customer Name

Text

---

People Count

Stepper

1

---

Session Type

Radio Buttons

○ 30 Minutes

○ 60 Minutes

○ Custom

○ Open

---

Custom Duration

Visible only if

Custom selected.

---

Payment

Paid

Partial

Unpaid

---

Rental Items

Checkboxes

☐ Board

☐ Shorts

☐ Deposit

---

Notes

Optional.

---

Buttons

Cancel

Create Session

---

Validation

Errors shown immediately.

---

Maximum creation time

10 seconds.

---

# Screen 4 — Edit Customer

Very similar to Add Customer.

Differences

Session already exists.

Current values prefilled.

Additional section

Extend Session

Buttons

+30

+60

Custom

---

Save Button

Large

Bottom

Sticky

---

# Screen 5 — Dashboard

Purpose

Business overview.

---

Cards

Today's Revenue

Today's Customers

Monthly Revenue

Monthly Customers

Lifetime Revenue

Lifetime Customers

Currently Active

Expired Sessions

Near Expiration

---

Charts

Version 1

Simple only.

No advanced analytics.

---

Refresh

Automatic.

---

# Screen 6 — History

Purpose

Archive.

---

Top Section

Search

Filter

Date Range

---

Filters

Today

Yesterday

Week

Month

Custom

---

Session Card

Customer Name

Duration

Total Paid

Date

Tap to expand.

---

Expanded View

Shows

Everything

Payment

Rentals

Notes

Session Type

Times

---

Performance

Infinite scrolling.

---

# Screen 7 — Settings

Simple page.

---

Prices

Hour Price

Board

Shorts

Deposit

---

Notifications

Enable Sound

Enable Vibration

Warning Minutes

---

About

Version

Developer

Storage Size

---

Reset

Reset Settings

Confirmation Required.

---

# Dialogs

## Finish Session

```
Finish Session?

Customer

Mohamed

Duration

60 Minutes

Total

150 EGP

[Cancel]

[Finish]
```

---

## Extend Session

Buttons

+30

+60

Custom

---

## Delete Custom Rental

Confirmation.

---

# Empty States

No Active Customers

```
No active sessions.

Tap + to add a customer.
```

---

No History

```
History is empty.
```

---

No Search Results

```
No matching customer found.
```

---

# Loading States

Small circular progress indicators.

No full-screen loaders except Splash.

---

# Error States

Friendly messages.

Examples

```
Unable to save data.
```

```
Invalid duration.
```

```
Storage error.
```

---

# Accessibility

Large touch targets.

Readable fonts.

High contrast.

No information conveyed only by color (e.g., pair colors with labels/icons).

---

# Performance Requirements

Home Screen

60 FPS scrolling.

Search

Instant.

Timer Updates

Smooth.

Memory Usage

Low.

Battery Consumption

Minimal.

---

# UI Consistency Rules

Every screen must follow the same spacing system:

- 16dp horizontal padding
    
- 12dp spacing between cards
    
- 8dp spacing between controls
    
- 48dp minimum touch target
    
- Consistent corner radius across all cards and buttons
    

---

# PART 4 — Database Design & Data Models

**Version:** 1.0

---

# Database Overview

The application is **Offline First**.

No backend server.

No cloud database.

No internet connection required.

All data shall be stored locally using SQLite.

---

# Database Requirements

The database shall:

- Support offline operation.
    
- Support at least 100,000 history records.
    
- Maintain data integrity.
    
- Prevent duplicate active sessions.
    
- Recover correctly after unexpected application shutdown.
    
- Preserve active timers after device restart.
    

---

# Database Schema

The application consists of the following tables:

```text
Settings

Customers

Sessions

RentalItems

SessionRentals

History

DashboardCache
```

---

# Table 1 — Settings

Stores global application configuration.

|Field|Type|Description|
|---|---|---|
|id|INTEGER PK|Always 1|
|hour_price|REAL|Price per hour|
|half_hour_price|REAL|Price for 30 minutes (optional override)|
|warning_minutes|INTEGER|Default = 5|
|sound_enabled|BOOLEAN|Notifications|
|vibration_enabled|BOOLEAN|Notifications|
|created_at|DATETIME|Creation time|
|updated_at|DATETIME|Last modification|

---

Business Rules

Only one record exists.

---

# Table 2 — Customers

Stores customer information while active.

|Field|Type|
|---|---|
|id|INTEGER PK|
|full_name|TEXT|
|people_count|INTEGER|
|notes|TEXT|
|created_at|DATETIME|

---

Rules

Customer record removed after session completion.

History keeps permanent copy.

---

# Table 3 — Sessions

The heart of the application.

|Field|Type|
|---|---|
|id|INTEGER PK|
|customer_id|FK|
|session_type|ENUM|
|start_timestamp|INTEGER|
|end_timestamp|INTEGER|
|actual_end_timestamp|INTEGER|
|duration_minutes|INTEGER|
|is_open_session|BOOLEAN|
|payment_status|ENUM|
|total_amount|REAL|
|status|ENUM|
|created_at|DATETIME|

---

Status Values

```text
ACTIVE

WARNING

EXPIRED

FINISHED
```

---

Payment Status

```text
PAID

PARTIAL

UNPAID
```

---

Session Types

```text
HALF_HOUR

ONE_HOUR

CUSTOM

OPEN
```

---

# Table 4 — RentalItems

Stores available rental types.

Default records:

|Name|Price|
|---|---|
|Board|Settings|
|Shorts|Settings|
|Deposit|Settings|

Future custom rentals stored here.

---

Fields

|Field|Type|
|---|---|
|id|INTEGER PK|
|name|TEXT|
|default_price|REAL|
|active|BOOLEAN|

---

# Table 5 — SessionRentals

Many-to-many relationship.

One session

↓

Many rentals.

---

Fields

|Field|Type|
|---|---|
|id|INTEGER PK|
|session_id|FK|
|rental_item_id|FK|
|quantity|INTEGER|
|price|REAL|
|paid|BOOLEAN|

---

Example

```text
Session 15

↓

Board

↓

30 EGP
```

---

# Table 6 — History

Permanent archive.

Never automatically deleted.

---

Fields

|Field|Type|
|---|---|
|id|INTEGER PK|
|customer_name|TEXT|
|people_count|INTEGER|
|session_type|TEXT|
|start_timestamp|INTEGER|
|finish_timestamp|INTEGER|
|booked_duration|INTEGER|
|actual_duration|INTEGER|
|rentals_json|TEXT|
|notes|TEXT|
|payment_status|TEXT|
|total_amount|REAL|
|created_at|DATETIME|

---

Reason

History must remain independent even if active tables change.

---

# Table 7 — DashboardCache

Stores calculated values for fast loading.

---

Fields

|Field|Type|
|---|---|
|today_revenue|REAL|
|month_revenue|REAL|
|lifetime_revenue|REAL|
|today_customers|INTEGER|
|month_customers|INTEGER|
|lifetime_customers|INTEGER|
|updated_at|DATETIME|

---

# Relationships

```text
Customers

↓

Sessions

↓

SessionRentals

↓

RentalItems
```

History independent.

---

# Data Flow

Customer Added

↓

Customer Table

↓

Session Table

↓

Timer Running

↓

Finish

↓

Copy to History

↓

Delete Active Customer

↓

Update Dashboard

---

# Indexes

Required indexes

Customers

```sql
full_name
```

---

Sessions

```sql
status
```

```sql
end_timestamp
```

```sql
customer_id
```

---

History

```sql
customer_name
```

```sql
finish_timestamp
```

---

RentalItems

```sql
name
```

---

# Timestamp Strategy

All timers use Unix Timestamp.

Example

```text
1750501200
```

Never use running counters.

Current Remaining Time

```text
Remaining

=

EndTimestamp

-

CurrentTimestamp
```

Advantages

- Accurate
    
- Battery friendly
    
- Restart safe
    

---

# Local Storage Strategy

SQLite

↓

Settings

↓

History

↓

Sessions

↓

Customers

No JSON files.

No SharedPreferences except theme if needed.

---

# Data Integrity Rules

Cannot finish already finished session.

Cannot extend finished session.

Cannot create customer without session.

Cannot create session without customer.

Cannot delete history accidentally.

---

# Migration Strategy

Every database version has

Migration Number.

Example

```text
Version 1

↓

Version 2

↓

Version 3
```

No destructive migration allowed.

User data must survive updates.

---

# Backup Strategy (V1)

Manual export only (future).

No cloud sync.

---

# Performance Expectations

History

100,000+

records

↓

Search

<100 ms

---

Database startup

<500 ms

---

Insert session

<50 ms

---

Finish session

<100 ms

---

# Future Compatibility

Schema designed for:

- Multiple swimming pools
    
- Employee accounts
    
- Cloud sync
    
- Customer database
    
- Reservations
    
- Memberships
    
- Analytics
    

without major redesign.

---

# Repository Layer

Each table has its own repository.

```text
SettingsRepository

CustomerRepository

SessionRepository

RentalRepository

HistoryRepository

DashboardRepository
```

Repositories isolate database logic from UI.

---

# Transaction Rules

Critical operations (like finishing a session) must be wrapped in a database transaction:

```text
BEGIN TRANSACTION

↓

Insert into History

↓

Delete Active Session

↓

Delete Active Customer

↓

Update Dashboard

↓

COMMIT
```

If any step fails:

```text
ROLLBACK
```

No partial updates allowed.

---

# Data Validation Rules

Before saving:

- Name cannot be empty.
    
- People count ≥ 1.
    
- Duration > 0 (except Open).
    
- Prices ≥ 0.
    
- Rental quantity ≥ 1.
    
- Settings record must always exist.
    

---

# Data Retention Policy

- Active data lives in `Customers` + `Sessions`.
    
- Completed sessions are archived forever in `History`.
    
- Dashboard values are derived and cached.
    
- No automatic deletion.
    
- Future versions may support manual export/import, but not deletion by default.
    


---

# PART 5 — Software Architecture & Technical Design

Version 1.0

---

# Architecture Philosophy

The application must be designed as a **production-ready application**, not as a demo.

Every module should be:

- Independent
    
- Testable
    
- Reusable
    
- Maintainable
    
- Scalable
    

The application should follow:

> **Clean Architecture + Feature-Based Structure**

---

# High Level Architecture

```text
UI Layer
     │
     ▼
Presentation Layer
     │
     ▼
Business Logic Layer
     │
     ▼
Repository Layer
     │
     ▼
Database Layer
```

---

# Technology Stack

## Framework

React Native

---

## Language

TypeScript

---

## UI

React Native Paper (Material Design 3)

---

## Navigation

React Navigation

---

## Database

SQLite

---

## Local Storage

SQLite

(No AsyncStorage except tiny preferences if absolutely necessary.)

---

## State Management

Zustand

Reason:

- Lightweight
    
- Fast
    
- Easy to maintain
    
- Excellent with local apps
    

---

## Forms

React Hook Form

---

## Validation

Zod

---

## Date Handling

Day.js

---

## Notifications

Expo Notifications

---

## Build

Expo + EAS Build

---

# Folder Structure

```text
src/

    assets/

    components/

        common/

        customer/

        dashboard/

        history/

        settings/

    screens/

        Home/

        AddCustomer/

        EditCustomer/

        Dashboard/

        History/

        Settings/

    navigation/

    database/

        migrations/

        repositories/

        schema/

    hooks/

    services/

    stores/

    models/

    types/

    constants/

    utils/

    theme/

    notifications/

    timer/

```

---

# Feature Isolation

Every feature owns its logic.

Example

```text
History

↓

History Screen

History Components

History Hooks

History Repository

History Types
```

No feature should directly access another feature's internals.

---

# Component Rules

Components must be:

Small

Reusable

Pure whenever possible

---

Example

```text
CustomerCard

SearchBar

SummaryCard

TimerLabel

PaymentBadge

RentalChip

PrimaryButton

ConfirmDialog
```

---

Never create giant components.

Maximum

300 lines

Recommended

150 lines

---

# Screen Rules

One screen

↓

One responsibility

Example

Home Screen

Only displays active sessions.

No database logic.

No timer calculations.

---

# Business Logic

Business logic belongs inside

Services

Example

```text
TimerService

PaymentService

HistoryService

DashboardService

NotificationService
```

Never inside UI.

---

# Repository Pattern

Every table has one repository.

Example

```text
SessionRepository

CustomerRepository

HistoryRepository

SettingsRepository
```

Responsibilities

Read

Write

Update

Delete

Search

Transactions

Nothing else.

---

# Service Layer

Services combine repositories.

Example

Finish Session

↓

History Repository

↓

Dashboard Repository

↓

Customer Repository

↓

Session Repository

UI never knows this complexity.

---

# State Management

Zustand Stores

```text
CustomerStore

SessionStore

SettingsStore

DashboardStore

HistoryStore

SearchStore
```

Each store handles only its own state.

---

# Timer Engine

One of the most critical modules.

Timers are never based on:

```text
setInterval()
```

Instead:

```text
remaining =
endTimestamp - currentTimestamp
```

The UI refreshes periodically, but the source of truth is always the stored timestamps.

---

# Timer Update Frequency

Home Screen

Every second

Only updates visible cards.

Background

No updates.

On resume

Recalculate immediately.

---

# Notification Engine

Every minute

Check

↓

Any session entering warning period?

↓

Send notification.

---

Every minute

Check

↓

Any session expired?

↓

Notify.

---

Notifications grouped if multiple sessions expire together.

---

# Dashboard Engine

Dashboard values are calculated from History.

Cached locally.

Refreshes

When session finishes.

No expensive recalculation every launch.

---

# Search Engine

Realtime.

Case insensitive.

Accent insensitive (where applicable).

Debounced

150 ms.

---

# Error Handling

Every async function returns

```text
Success

or

Failure
```

Never throw raw errors into UI.

---

# Logging

Development

Console logging enabled.

Production

No console logs.

No debug output.

---

# Constants

Never hardcode.

Example

```text
WARNING_TIME = 5

DEFAULT_SESSION = 60

MAX_NAME_LENGTH = 50
```

Everything centralized.

---

# Theme

Single theme provider.

Supports future Dark Mode without refactoring.

---

# Naming Conventions

Components

PascalCase

```text
CustomerCard
```

Hooks

```text
useTimer()
```

Repositories

```text
HistoryRepository
```

Stores

```text
SettingsStore
```

Constants

```text
DEFAULT_WARNING_MINUTES
```

---

# File Naming

```text
customer-card.tsx

history-screen.tsx

payment-service.ts

timer-store.ts
```

Consistent kebab-case.

---

# Dependency Rules

Allowed

```text
Screen

↓

Store

↓

Service

↓

Repository

↓

Database
```

Forbidden

```text
Screen

↓

Database
```

---

# Performance Rules

Avoid unnecessary renders.

Use memoization where appropriate.

Lazy load heavy screens.

Virtualize long history lists.

---

# Security Rules

No sensitive data.

No hidden APIs.

No internet permissions unless required.

No analytics.

No trackers.

---

# Testing Strategy

Every Service should be independently testable.

Business logic separated from UI.

Repositories mockable.

---

# Coding Standards

- Strict TypeScript mode.
    
- ESLint enabled.
    
- Prettier formatting.
    
- No `any` type unless justified.
    
- Functions should have a single responsibility.
    
- Prefer composition over inheritance.
    

---

# AI Coding Rules

The AI must follow these rules during implementation:

1. Never generate placeholder code.
    
2. Never leave TODO or FIXME comments.
    
3. Never duplicate logic.
    
4. Refactor repeated code into reusable utilities/components.
    
5. After each feature, review and improve the code before continuing.
    
6. Keep files small and focused.
    
7. Write self-documenting code with meaningful names.
    
8. Use comments only where business logic is non-obvious.
    

---

# Build Quality Gates

A feature is **NOT complete** until:

- ✔ Compiles without errors.
    
- ✔ Passes lint.
    
- ✔ No TypeScript errors.
    
- ✔ UI matches the specification.
    
- ✔ Business rules are respected.
    
- ✔ Data persists correctly.
    
- ✔ No regressions introduced.
    

---

# Release Requirements

Before generating the APK:

- Remove debug code.
    
- Verify notification behavior.
    
- Verify timer accuracy after app restart.
    
- Verify history integrity.
    
- Verify dashboard calculations.
    
- Ensure release build succeeds.
    

---

# Architecture Summary

```text
User
   │
   ▼
Screen
   │
   ▼
Store
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
SQLite
```

Each layer has one clear responsibility and communicates only with the layer directly below it.

---

# PART 6 — Business Logic & Edge Cases

Version 1.0

---

# Philosophy

The application must always produce predictable behavior.

No action should leave the application in an undefined state.

Every user interaction must have a clearly defined result.

---

# Session Lifecycle

Every session follows the exact lifecycle.

```text
Create

↓

Active

↓

Warning

↓

Expired

↓

Finished

↓

History
```

A session may never skip states.

---

# State Definitions

## ACTIVE

Remaining time > Warning Time

Card

White

---

## WARNING

Remaining time ≤ Warning Time

Card

Yellow

Notification

None

---

## EXPIRED

Remaining time ≤ 0

Card

Red

Notification

Sound

Vibration

Android Notification

---

## FINISHED

Session archived.

Removed from Home.

Visible in History only.

---

# Customer Creation Rules

Customer name required.

People count

Minimum

1

Maximum

99

Duplicate names allowed.

Reason

Two customers may legitimately have identical names.

Every session identified by Session ID.

---

# Session Rules

Only one active session per customer record.

A finished session cannot be reactivated.

A new visit always creates a new session.

---

# Half Hour Logic

Fixed duration

30 minutes.

Price

Settings.HalfHourPrice

or

HourPrice ÷ 2

---

# One Hour Logic

Fixed

60 minutes.

---

# Custom Session Logic

User enters minutes.

Minimum

5

Maximum

720

Price

```
(Duration / 60)

×

Hour Price
```

Rounded according to pricing rules.

---

# Open Session Logic

Start timestamp stored.

No end timestamp.

Timer counts upward.

Finish

↓

Elapsed Minutes

↓

Calculate Price

↓

Archive

---

# Pricing Rules

Fixed sessions

Always charged booked duration.

Example

Booked

60

Left after

20

Charge

60

---

Open session

Charged actual duration.

---

# Price Rounding

Default

Nearest whole currency.

Example

```
121.7

↓

122
```

Future versions may support custom rounding.

---

# Extension Rules

Extension available

Only for Active

Warning

Expired

Not Finished.

---

Example

```
End

11:00

↓

+30

↓

11:30
```

Never extend from current time.

Always extend from current end timestamp.

---

# Multiple Extensions

Allowed.

Unlimited.

Example

```
+30

↓

+30

↓

+60

↓

Total +120
```

---

# Payment Rules

Payment Status

Paid

↓

Nothing outstanding.

---

Partial

↓

Outstanding items remain.

---

Unpaid

↓

Everything outstanding.

---

Changing payment

Never affects timer.

---

# Rental Rules

Default rentals

Board

Shorts

Deposit

Custom rentals allowed.

Rental quantity

Minimum

1

---

Rental prices

Copied into session.

Reason

Changing settings later

Must not modify old sessions.

---

# Settings Change Rules

Hour price changed.

Existing sessions

Keep old price.

New sessions

Use new price.

Reason

Historical accuracy.

---

Rental price changed.

Same behavior.

---

# Notification Rules

Notification fired only once.

Never repeat every minute.

---

Grouped notifications.

Example

```
3 Sessions Expired
```

instead of

3 separate notifications.

---

# Warning Rules

Yellow state

Only visual.

No notification.

---

# App Restart Rules

Application starts.

↓

Read Sessions

↓

Read Current Time

↓

Recalculate Every Timer

↓

Continue

---

No timer resumes from memory.

Everything recalculated.

---

# Device Restart Rules

Phone restarted.

↓

Application opens.

↓

Recalculate all timers.

---

No lost sessions.

---

# Midnight Rules

Session starts

23:45

Ends

00:45

Valid.

History stores correct dates.

Dashboard counts finish date.

---

# Timezone Rules

Always use local device timezone.

Future cloud versions may use UTC.

---

# Search Rules

Case insensitive.

Trim spaces.

Realtime.

No special characters required.

---

# Sorting Rules

Priority

Expired

↓

Warning

↓

Remaining Time Ascending

↓

Alphabetical

---

# Dashboard Rules

Updated only when

Session Created

Session Finished

Settings Changed

Never every second.

---

# History Rules

Permanent.

No automatic deletion.

Newest first.

---

# Edit Rules

Allowed

Name

People

Payment

Rentals

Notes

Not Allowed

Session ID

Creation Time

---

# Finish Rules

Finish

↓

Create History

↓

Update Dashboard

↓

Delete Active Session

↓

Delete Customer

All inside transaction.

---

# Undo Rules

Undo available

5 seconds.

After timeout

Permanent.

---

# Empty State Rules

No customers

↓

Show Empty View.

---

No history

↓

Show Empty View.

---

Search no results

↓

Show Empty View.

---

# Crash Recovery

Application crashes.

↓

Restart.

↓

Recover Active Sessions.

↓

No data loss.

---

# Storage Failure

If database unavailable

Show error.

Never crash.

---

# Corrupted Record

Ignore invalid record.

Log error.

Continue loading.

---

# Simultaneous Expiration

Five customers finish

Same second.

↓

Five cards become red.

↓

One grouped notification.

---

# Very Long Open Session

Allowed.

Example

12 hours.

Timer continues.

---

# Negative Time

Never displayed.

Expired sessions show

```
Expired

+00:15
```

instead of

```
-00:15
```

---

# Clock Change

If device time changes manually:

Application recalculates from new system time.

No internal timer offsets.

---

# Low Battery Mode

Application still relies on timestamps.

No timer drift.

---

# Screen Rotation

No state loss.

---

# Fast Repeated Clicks

Prevent duplicate actions.

Example

Finish button

↓

Disabled until transaction completes.

---

# Validation Rules

Name

Required.

---

People

> =1

---

Duration

> 0

---

Hour Price

> =0

---

Rental Price

> =0

---

Warning Minutes

1–30

---

# Data Integrity Rules

Every active session

Must have customer.

Every history session

Must be immutable.

Dashboard values

Must equal history totals.

---

# Business Rule Priority

If two rules conflict:

1. Data Integrity
    
2. Historical Accuracy
    
3. Timer Accuracy
    
4. UI Consistency
    
5. User Convenience
    

---

# Future Compatibility Rules

Business logic should support future additions without breaking existing behavior:

- Multiple pools
    
- Employee accounts
    
- Memberships
    
- Reservations
    
- Cloud sync
    
- Reports
    
- Export to Excel/PDF
    

---

# Final Edge Case Checklist

|Case|Expected Behavior|
|---|---|
|Duplicate names|Allowed|
|Finish twice|Ignore second click|
|Extend expired session|Allowed|
|Finish expired session|Allowed|
|Change settings during active sessions|Existing sessions unchanged|
|Device restart|Timers restored|
|App crash|Sessions restored|
|Midnight crossing|Correct dates|
|Search empty|Empty state|
|Zero customers|Empty state|
|Multiple expirations|One notification|
|Duplicate button taps|Prevented|
|Open session > 12h|Supported|
|History >100k records|Supported|
|Offline mode|Fully supported|

---

# Acceptance Criteria

The application is considered **business-ready** when:

- No timer inconsistencies occur.
    
- No session data is lost.
    
- All business rules above are enforced.
    
- Dashboard values remain accurate.
    
- History is immutable.
    
- Active sessions always recover after restart.
    
- Every edge case in this document behaves exactly as specified.
    


---

# PART 7 — Development Roadmap & Task Breakdown

Version 1.0

Status: Approved

---

# Development Strategy

The project **MUST NOT** be developed all at once.

Development shall follow an incremental approach.

Each task must:

- Compile successfully
    
- Pass TypeScript checks
    
- Pass linting
    
- Be manually verified
    
- Be reviewed before continuing
    

The AI **must never continue** to the next task if the current task is incomplete.

---

# Project Phases

```text
Phase 1
Project Setup

↓

Phase 2
Core Infrastructure

↓

Phase 3
Settings

↓

Phase 4
Customer Management

↓

Phase 5
Timer Engine

↓

Phase 6
Notifications

↓

Phase 7
Dashboard

↓

Phase 8
History

↓

Phase 9
Polish

↓

Phase 10
Release
```

---

# Definition of Done (DoD)

A task is complete only if:

✅ Code compiles.

✅ No TypeScript errors.

✅ No ESLint errors.

✅ UI matches specification.

✅ Business logic implemented.

✅ Manual test passed.

✅ Code reviewed.

✅ No duplicated code.

✅ Proper naming used.

---

# Sprint 1 — Project Setup

---

### TASK-001

Title

Create React Native Project

Priority

Critical

Dependencies

None

Steps

- Create Expo project
    
- Enable TypeScript
    
- Configure ESLint
    
- Configure Prettier
    

Acceptance

✔ Project starts successfully

---

### TASK-002

Configure Folder Structure

Acceptance

✔ Every folder exists according to Architecture document.

---

### TASK-003

Install Dependencies

Install

- React Navigation
    
- Zustand
    
- SQLite
    
- React Hook Form
    
- Zod
    
- Day.js
    
- Expo Notifications
    

Acceptance

✔ All packages installed.

---

### TASK-004

Navigation

Create

- Stack
    
- Theme
    
- Initial Route
    

Acceptance

✔ Navigation works.

---

### TASK-005

Theme

Create

- Colors
    
- Typography
    
- Spacing
    
- Radius
    

Acceptance

✔ Theme Provider ready.

---

# Sprint 2 — Database

---

### TASK-006

Create SQLite Database

---

### TASK-007

Create Tables

Settings

Customers

Sessions

RentalItems

SessionRentals

History

DashboardCache

---

### TASK-008

Create Repositories

---

### TASK-009

Create Database Services

---

### TASK-010

Database Migration

Acceptance

✔ Database initializes correctly.

---

# Sprint 3 — Settings

---

### TASK-011

Settings Screen Layout

---

### TASK-012

Hour Price

---

### TASK-013

Rental Prices

---

### TASK-014

Warning Minutes

---

### TASK-015

Sound

---

### TASK-016

Vibration

---

### TASK-017

Persistence

Acceptance

✔ Restart keeps settings.

---

# Sprint 4 — Customer Module

---

### TASK-018

Customer Model

---

### TASK-019

Add Customer Screen

---

### TASK-020

Validation

---

### TASK-021

Save Customer

---

### TASK-022

Edit Customer

---

### TASK-023

Delete Active Customer

---

### TASK-024

Customer Card Component

---

### TASK-025

Customer Store

Acceptance

✔ Customer workflow complete.

---

# Sprint 5 — Timer Engine

---

### TASK-026

Timestamp Engine

---

### TASK-027

Remaining Time Calculation

---

### TASK-028

Open Timer

---

### TASK-029

Warning State

---

### TASK-030

Expired State

---

### TASK-031

Auto Refresh

---

### TASK-032

Timer Persistence

Acceptance

✔ Timers survive restart.

---

# Sprint 6 — Notifications

---

### TASK-033

Notification Service

---

### TASK-034

Warning Detection

---

### TASK-035

Expiration Detection

---

### TASK-036

Grouped Notifications

---

### TASK-037

Sound

---

### TASK-038

Vibration

Acceptance

✔ Notifications reliable.

---

# Sprint 7 — Dashboard

---

### TASK-039

Dashboard Repository

---

### TASK-040

Dashboard Cards

---

### TASK-041

Revenue Calculation

---

### TASK-042

Customer Statistics

---

### TASK-043

Refresh Logic

Acceptance

✔ Dashboard accurate.

---

# Sprint 8 — History

---

### TASK-044

History Repository

---

### TASK-045

Finish Session

---

### TASK-046

Archive Session

---

### TASK-047

Search History

---

### TASK-048

Filters

---

### TASK-049

History Details

Acceptance

✔ History complete.

---

# Sprint 9 — UI Polish

---

### TASK-050

Loading States

---

### TASK-051

Empty States

---

### TASK-052

Dialogs

---

### TASK-053

Animations

---

### TASK-054

Icons

---

### TASK-055

Accessibility

Acceptance

✔ UI polished.

---

# Sprint 10 — Quality Assurance

---

### TASK-056

Manual Testing

---

### TASK-057

Edge Case Testing

---

### TASK-058

Performance Testing

---

### TASK-059

Memory Testing

---

### TASK-060

Battery Testing

Acceptance

✔ No critical bugs.

---

# Sprint 11 — Release

---

### TASK-061

Production Build

---

### TASK-062

Remove Debug Logs

---

### TASK-063

Final Code Review

---

### TASK-064

Generate APK

---

### TASK-065

Release Verification

Acceptance

✔ APK installs and runs.

---

# AI Workflow Rules

The AI **must** follow this exact process:

1. Read the entire Project Specification.
    
2. Produce an implementation plan.
    
3. Verify dependencies.
    
4. Execute **one task only**.
    
5. Run the project.
    
6. Fix all errors.
    
7. Refactor the code if necessary.
    
8. Mark the task as ✔ Completed.
    
9. Proceed to the next task.
    

The AI must **never** skip tasks or merge multiple tasks into one implementation.

---

# Quality Gates

Before marking any task complete:

- Project builds successfully.
    
- No runtime errors.
    
- UI matches specification.
    
- Business rules verified.
    
- Code reviewed.
    
- No duplicated code.
    
- No TODO/FIXME comments.
    

---

# Final Acceptance Checklist

Before generating the APK, the AI must verify:

- ✔ All screens implemented.
    
- ✔ All navigation works.
    
- ✔ Database schema matches specification.
    
- ✔ Timers accurate after restart.
    
- ✔ Notifications work.
    
- ✔ Dashboard statistics correct.
    
- ✔ History archive correct.
    
- ✔ Search functional.
    
- ✔ Settings persistent.
    
- ✔ Offline mode fully functional.
    
- ✔ No crashes.
    
- ✔ No memory leaks.
    
- ✔ Release build successful.
    

---

# Project Completion Criteria

The project is considered complete only when:

- Every task is marked ✔.
    
- Every acceptance criterion is satisfied.
    
- APK is generated.
    
- APK installs successfully on a physical Android device.
    
- All core business scenarios have been manually tested.
    

---

# PART 8 — AI Development Master Prompt

---

# ROLE

You are a Senior Software Engineer with 15+ years of experience.

You are also acting as:

- Software Architect
    
- Product Engineer
    
- React Native Expert
    
- TypeScript Expert
    
- SQLite Expert
    
- UI/UX Engineer
    
- QA Engineer
    
- Code Reviewer
    
- Performance Engineer
    

Your goal is **NOT** to generate code quickly.

Your goal is to build a production-ready Android application exactly according to the provided Project Specification.

The specification is the single source of truth.

Never ignore it.

Never replace it with assumptions.

---

# GENERAL RULES

Read the entire Project Specification before writing a single line of code.

Do not skip any section.

Do not invent features.

Do not remove features.

Do not simplify business rules.

Do not change the architecture.

Follow the specification exactly.

If something is unclear, infer the most reasonable solution without contradicting the specification.

---

# DEVELOPMENT PROCESS

You must work exactly like a professional software team.

Follow this sequence:

Planning

↓

Architecture

↓

Implementation

↓

Testing

↓

Refactoring

↓

Review

↓

Next Task

Never implement the entire application in one response.

---

# TASK EXECUTION

Read the Task Breakdown.

Execute ONE task only.

When finished:

Run a self-review.

Fix problems.

Mark task completed.

Proceed to next task.

---

# BEFORE WRITING CODE

For every task:

Explain:

- What will be implemented.
    
- Which files will be created.
    
- Which existing files will change.
    
- Which dependencies are involved.
    
- Possible risks.
    

Only then start implementation.

---

# AFTER WRITING CODE

Review:

Architecture

Naming

Performance

Reusability

Type Safety

Business Logic

UI Consistency

Error Handling

Accessibility

If improvements exist

Implement them immediately.

---

# CODE QUALITY RULES

Never use:

TODO

FIXME

Temporary Code

Dummy Logic

Fake Implementations

Copy/Paste Code

Large Components

Large Functions

Magic Numbers

Hardcoded Strings

---

Always use:

TypeScript

Strict Types

Reusable Components

Reusable Hooks

Repository Pattern

Service Layer

Proper Error Handling

Meaningful Names

Clean Folder Structure

Reusable Utilities

---

# COMPONENT RULES

Every component

One responsibility.

Maximum

300 lines.

Preferred

150 lines.

If larger

Split.

---

# FUNCTION RULES

One responsibility.

Short.

Reusable.

Descriptive names.

No nested complexity.

---

# FILE RULES

One purpose per file.

Never create huge files.

---

# BUSINESS LOGIC RULES

Business logic never belongs inside UI.

UI only renders.

Logic belongs in

Services

Stores

Repositories

---

# DATABASE RULES

Never access SQLite directly from UI.

Always use Repository Layer.

All writes

Inside transactions where required.

---

# TIMER RULES

Never use timer counters as source of truth.

Always calculate from timestamps.

Timer must survive:

App restart

Phone reboot

Sleep mode

Background mode

---

# NOTIFICATION RULES

Notifications

Grouped.

Reliable.

One notification per event.

No spam.

---

# UI RULES

Use Material Design.

Large touch targets.

Readable fonts.

Smooth animations.

Consistent spacing.

Responsive layout.

---

# PERFORMANCE RULES

Avoid unnecessary renders.

Use memoization appropriately.

Optimize FlatList.

Lazy load where appropriate.

Never block UI thread.

---

# SECURITY RULES

No internet.

No analytics.

No tracking.

No hidden APIs.

No unnecessary permissions.

---

# ERROR HANDLING

Every async operation

Must return controlled errors.

Never crash.

Never expose raw stack traces.

---

# TESTING

After every completed feature

Run:

Manual Verification

Edge Case Verification

Business Rule Verification

Regression Check

Performance Check

Only then continue.

---

# SELF REVIEW

Before continuing ask yourself:

Does this exactly match the specification?

Can this code be simplified?

Can this be reused?

Any duplicated logic?

Any missing edge case?

If yes

Fix immediately.

---

# PROJECT COMPLETION

When every task is complete

Perform a complete project audit.

Review:

Architecture

Performance

Accessibility

Business Rules

Database

Notifications

History

Dashboard

Settings

Navigation

Timers

Refactor if necessary.

---

# FINAL BUILD

Generate:

Production Release

Release APK

No Debug Logs

No TODO

No TypeScript Errors

No ESLint Errors

No Runtime Errors

---

# FINAL DELIVERABLES

The AI must produce:

- Complete React Native Project
    
- SQLite Database
    
- Assets
    
- Components
    
- Hooks
    
- Services
    
- Stores
    
- Repositories
    
- Documentation
    
- Release APK
    
- Build Instructions
    
- Known Limitations (if any)
    

---

# IMPORTANT

The Project Specification overrides this prompt whenever a conflict exists.

Never ignore the specification.

Never take shortcuts.

Quality is more important than speed.

---

# APPENDIX A — Mandatory Project Analysis Phase

**Version:** 1.0

## Objective

Before implementing any feature, the AI **MUST** perform a complete project analysis.

No source code shall be generated before this phase is completed.

This phase is mandatory.

---

# Step 1 — Read the Entire Specification

Read the complete Project Specification from beginning to end.

Do not skip any section.

Read every document including:

- Product Requirements Document (PRD)
    
- Software Requirements Specification (SRS)
    
- Screen Specifications
    
- Database Design
    
- Software Architecture
    
- Business Rules
    
- Edge Cases
    
- Development Roadmap
    
- Task Breakdown
    

Do not start implementation until all documents have been completely analyzed.

---

# Step 2 — Build Internal Understanding

After reading the documentation, summarize your understanding of the project.

Your summary should include:

- Application purpose
    
- Main features
    
- User workflow
    
- Business rules
    
- Database structure
    
- Architecture
    
- Navigation
    
- Timer logic
    
- Notification logic
    
- Dashboard logic
    
- History system
    
- Settings system
    

The goal is to verify that the entire specification has been correctly understood before implementation begins.

---

# Step 3 — Architecture Review

Describe the planned software architecture.

Include:

- Folder Structure
    
- State Management
    
- Database Layer
    
- Repository Layer
    
- Service Layer
    
- Component Strategy
    
- Navigation Structure
    
- Timer Engine
    
- Notification Engine
    

Confirm that the proposed architecture fully matches the Project Specification.

---

# Step 4 — Dependency Review

List every external dependency required for the project.

For each dependency explain:

- Why it is required
    
- Where it will be used
    
- Any possible alternatives
    

No dependency should be installed without justification.

---

# Step 5 — Risk Assessment

Identify all potential technical risks before development.

Examples:

- Timer accuracy
    
- Background execution
    
- Notification reliability
    
- SQLite transactions
    
- Performance with large history
    
- Data persistence
    
- Edge case handling
    

For every risk provide the planned mitigation strategy.

---

# Step 6 — File Generation Plan

Generate a complete list of files and folders expected to be created.

Example:

- screens/
    
- components/
    
- services/
    
- repositories/
    
- hooks/
    
- stores/
    
- database/
    
- utils/
    
- constants/
    

For each folder briefly describe its responsibility.

---

# Step 7 — Implementation Strategy

Explain the development strategy.

Include:

- Task execution order
    
- Sprint sequence
    
- Feature dependencies
    
- Validation process
    
- Testing process
    

Confirm that development will follow the provided Task Breakdown without skipping any task.

---

# Step 8 — Requirement Validation

Verify that every required feature exists in the specification.

Generate a checklist containing every feature.

Example:

✔ Customer Management

✔ Active Timers

✔ Open Sessions

✔ Session Extension

✔ Dashboard

✔ History

✔ Search

✔ Settings

✔ Notifications

✔ Rentals

✔ Payments

✔ Statistics

✔ Offline Mode

✔ Local Database

If any required feature appears to be missing, stop and report it before implementation begins.

---

# Step 9 — Questions

If any ambiguity exists, list all questions together.

Do NOT make assumptions that contradict the specification.

If no clarification is required, explicitly state:

"No blocking questions. Ready to begin implementation."

---

# Step 10 — Readiness Report

End the analysis with the following report.

## Project Understanding

Score from 0–100%

## Architecture Confidence

Score from 0–100%

## Specification Completeness

Score from 0–100%

## Estimated Number of Files

Estimated Number of Components

Estimated Number of Screens

Estimated Number of Services

Estimated Number of Database Tables

Estimated Number of Development Tasks

Estimated Project Complexity

(Low / Medium / High)

Estimated Development Time

Provide a realistic estimate.

---

# Approval Rule

The AI MUST NOT generate any application code until this analysis has been completed successfully.

Only after the complete analysis is finished may the AI proceed to:

TASK-001 — Initialize Project.

---

# Expected First Response Format

The AI's very first response MUST follow this structure exactly:

✔ Project Specification successfully analyzed.

## Executive Summary

...

## Understanding of Requirements

...

## Architecture Review

...

## Technical Risks

...

## Dependency Analysis

...

## File Structure Plan

...

## Development Strategy

...

## Feature Checklist

...

## Questions (if any)

...

## Readiness Report

Project Understanding: 100%

Architecture Confidence: 100%

Ready to begin TASK-001.

No source code has been generated during this phase.