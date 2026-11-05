# Admin guide: SPIC MACAY IIM Lucknow website

This guide is for the chapter leader who owns the website's Vercel project. It covers setting up the site's services once, signing in, adding photos and content, and giving other volunteers access.

You don't need to write any code. Everything except the optional section at the end happens in your web browser.

---

## 1. How the site is put together

| Part | Where it lives | What it holds |
|---|---|---|
| **The website** | Your Vercel project, built from the GitHub repository `srivastavashivanshi/SPIC_MACAY` | All pages. Every push to `main` redeploys the site automatically. |
| **Database** (Neon) | Created inside your Vercel project (step 2a) | Everything you add or edit in the admin page: programmes, artists, team, photo details, featured videos, RSVPs, sign-ups and admin accounts |
| **Photo storage** (Vercel Blob) | Created inside your Vercel project (step 2b) | The photo files you upload |
| **Passwords and keys** | Vercel → your project → **Settings → Environment Variables** | The chapter password, the session secret, and the database and storage keys |

Until the database exists, the site shows its built-in content: the reach map, conventions, artists, art forms and the chapter's programmes from spicmacay.org. Once you start editing in the admin page, your changes are saved in the database and shown instead.

> **Keep the keys private.** The values in Environment Variables are like passwords. Never paste them into GitHub, chat groups or documents. Nothing secret is stored in the repository.

---

## 2. One-time setup in Vercel (about 15 minutes)

Open [vercel.com](https://vercel.com), sign in, and open the website's project. The menu names below are Vercel's current ones and may change slightly over time.

### 2a. Create the database

1. In your project, open the **Storage** tab.
2. Choose **Create Database** and pick **Neon** (Serverless Postgres). Accept the defaults; the free plan is enough. A region close to India, such as Singapore or Mumbai, makes it a little faster.
3. When asked, **connect it to this project** for all environments (Production, Preview, Development).

Vercel then adds `DATABASE_URL` (and some related keys) to your Environment Variables automatically. You don't need to copy anything. The site creates its tables by itself the first time it is used.

### 2b. Create photo storage

1. In the **Storage** tab again, choose **Create** and pick **Blob**.
2. Give it any name, such as `spicmacay-photos`, and **connect it to this project**.

Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.

### 2c. Set the chapter password and session secret

Go to **Settings → Environment Variables** and add two variables, for all environments:

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | The **chapter password** you will use to sign in. Choose a strong one (at least 12 characters, not used anywhere else) and keep it to yourself. |
| `ADMIN_SESSION_SECRET` | A long random string of **at least 32 characters**, used to secure sign-ins. Nobody ever types it. The easiest way is to generate a 40+ character password in any password manager (or Google Password Manager's "suggest password"). On a Mac or Linux terminal, `openssl rand -base64 48` also works. |

Optional:

| Name | Value |
|---|---|
| `VITE_WHATSAPP_URL` | A link to the chapter's WhatsApp channel or group. A "join our WhatsApp channel" button then appears beside the sign-up form on the home page. |

### 2d. Redeploy

New variables only take effect after a deploy. Go to **Deployments**, open the menu (⋯) on the latest deployment and choose **Redeploy**. Wait until it says **Ready**.

### 2e. Check it worked

Open `https://<your-site>/admin`. At the top, after signing in (next step), you should see:

- **Database (NeonDB) connected**
- **Photo storage (Vercel Blob) connected**

If either says it's missing, see *Troubleshooting* at the end.

---

## 3. Signing in

1. Open `https://<your-site>/admin`, or click **Volunteer login** in the site's footer.
2. **Leave Email blank**, type the chapter password from step 2c, and click **Sign in**.

You are now signed in as the **owner**. You can do everything, including deciding who else gets access. A sign-in lasts 12 hours.

---

## 4. First things to do after signing in

Do these once, in this order:

1. **Import** tab: keep the match text as `IIM Lucknow` and click **Import programmes**. This copies the chapter's programmes listed on spicmacay.org into the database. You can run it again whenever new programmes appear there; it keeps anything you've added (time, attendance, description).
2. **Artists** tab: click **Copy into database**. This moves the built-in artist list into the database so your edits add to it instead of replacing it.
3. **Team** tab: click **Copy into database**, then add the chapter's volunteers with **+ Add**.

---

## 5. Everyday tasks

### Upload photos

1. Open the **Photos** tab.
2. Choose one or more photos (JPEG, PNG or WebP, up to 8 MB each; large photos are shrunk automatically).
3. Pick the **programme** they belong to, add a **caption** and the **date taken** if you like, and click **Upload**.

Photos appear straight away in:

- the **carousel on the home page** (the 10 newest photos);
- the **Gallery** page;
- the page of the programme they're tagged with.

To remove a photo, click **Delete** under it in the Photos tab. This also deletes the file from storage.

### Add or edit a programme

Open the **Programmes** tab and click **+ Add**, or **Edit** on an existing one.

- **Title** and **date** are required.
- Add a **start time** (IST) so the *Add to Google Calendar* button uses the right time.
- After the programme, fill in **Attendance**. The chapter dashboard's charts use it.
- Choose the **artist** from the list if they're in the Artist Explorer, or type their name.

Changes show on the chapter dashboard, the programme's own page, and the art form and artist pages. Each programme page also has a downloadable poster and a printable "Before the concert" guide.

### Other tabs

| Tab | What it's for |
|---|---|
| **Artists** | Add or edit artists in the Artist Explorer |
| **Team** | The chapter team shown on the dashboard (*Display order* sets the order) |
| **RSVPs** | Who tapped "I'll attend" on upcoming programmes; download as CSV |
| **Subscribers** | People who signed up for programme announcements; download as CSV; **Remove** anyone who asks to be removed |
| **Featured video** | Pin a YouTube performance to an art form; it plays on the home page in that art form's week |
| **Access** | Give other volunteers their own login (next section) |

---

## 6. Giving other volunteers access

Each volunteer should have their **own login** rather than the chapter password. That way you can remove one person without changing everyone's password.

1. Sign in and open the **Access** tab.
2. Enter their email and choose a role:
   - **Admin**: can upload photos and edit all content, but cannot manage access.
   - **Owner**: can also invite, reset and remove people.
3. Click **Create invitation**, then **Copy link** (to send on WhatsApp) or **Email it** (opens your email app with the message ready).
4. They open the link **within 7 days**, choose their own password, and from then on sign in at `/admin` with their **email and password**.

The link is shown only once. If it's lost or expires, click **New link** next to their name.

In the same tab you can see each person's status and last sign-in. **Reset password** sends them a fresh link and signs them out; **Remove** ends their access immediately.

### A personal login for yourself (optional)

You can invite your own email as **Owner** and use that day to day, keeping the chapter password for emergencies.

---

## 7. Where your data is kept

| Data | Location |
|---|---|
| Programmes, artists, team, photo captions, featured videos | Neon database → tables `events`, `artists`, `team`, `gallery`, `features` |
| RSVPs and sign-ups (names, emails, phone numbers) | Neon tables `rsvps` and `subscribers`. **Private**: only visible to signed-in admins |
| Admin accounts | Neon table `admins`. Passwords are stored only as secure hashes, never readable |
| Photo files | Vercel Blob store, in the `gallery/` folder |
| Built-in content (reach map, conventions, art forms, glossary, ragas…) | The `src/data/` folder in the GitHub repository |

To look at the data directly: Vercel → **Storage** → your Neon database → **Open in Neon**, then use the **Tables** or **SQL Editor** view. Editing through the admin page is safer.

Because RSVPs and sign-ups contain personal contact details, share the CSV exports only with volunteers who need them, and delete people's details when they ask.

---

## 8. Troubleshooting

| What you see | What to do |
|---|---|
| "Sign-in isn't set up yet" on `/admin` | `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` is missing, or the secret is shorter than 32 characters. Fix it in Environment Variables, then **Redeploy**. |
| "Database (NeonDB) — add DATABASE_URL" | The Neon database isn't connected to this project. Repeat step 2a, then **Redeploy**. |
| "Photo storage … connect a Blob store" | Repeat step 2b, then **Redeploy**. |
| "That password is not right" | For the chapter password, leave **Email blank**. The password is the exact value of `ADMIN_PASSWORD`. |
| A volunteer's invitation link doesn't work | It was already used or is older than 7 days. Click **New link** in the Access tab. |
| An edit doesn't show on the site | Refresh the page. Public pages can take up to a minute to update everywhere. |
| Forgot the chapter password | Set a new `ADMIN_PASSWORD` in Environment Variables and **Redeploy**. |

---

## 9. Optional: working from a computer

This is only for volunteers comfortable with a terminal; nothing above needs it. You need [Node.js](https://nodejs.org) 22 or later and access to the GitHub repository.

```bash
git clone https://github.com/srivastavashivanshi/SPIC_MACAY.git
cd SPIC_MACAY
npm install
```

Copy the values of `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` and `BLOB_READ_WRITE_TOKEN` from Vercel into a file named `.env` (see `.env.example`). Never commit that file; it's already excluded from git.

| Command | What it does |
|---|---|
| `npm run dev` | Runs the site on your computer at http://localhost:5173, using the live database |
| `npm run admin:invite -- name@iiml.ac.in --site https://<your-site>` | Creates an invitation and prints the link (add `--role owner` for an owner) |
| `npm run import:spicmacay` | Refreshes the built-in programme list from spicmacay.org |
| `npm run import:appearances` | Refreshes each artist's SPIC MACAY appearances |

See [README.md](README.md) for the full technical documentation.
