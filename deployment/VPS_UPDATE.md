# Updating the existing PHP/Nginx VPS

The checked-in `.github/workflows/deploy.yml` deploys pushes to `main` to `s20230204011@187.52.122.100`, directory `~/laravel`. That directory holds the built Laravel release, not necessarily a Git checkout. Do not run `git pull` there unless you have confirmed it is a checkout.

## Before pushing this upgrade

Take a VPS/database backup using your existing backup procedure, including `~/laravel/.env` and `~/laravel/storage`. The migration adds tables and columns and copies existing topics; it does not reset the database. Keep the same `APP_KEY`. Confirm `APP_TIMEZONE=Asia/Dhaka` in the VPS `.env` so dashboard date counts use campus time.

Run the local checks in the README, commit changed/new files, and push your normal branch. Pushing/merging to **main** starts **Deploy to VPS** in GitHub Actions. Wait for that workflow to succeed before running manual refresh commands. This coding task did not deploy to the VPS.

The updated workflow runs frontend lint/build and all API tests before uploading; excludes `.env`, storage and generated caches from the release; enters maintenance mode before extraction; migrates, rebuilds caches and exits maintenance mode afterward.

No manual refresh is normally necessary after a successful workflow. If automatic deployment is disabled, trigger **Deploy to VPS → Run workflow** for `main`. The following commands alone cannot copy the updated code or rebuild React assets.

## Manual refresh after the updated release reaches the VPS

```bash
ssh s20230204011@187.52.122.100
cd "$HOME/laravel"
(
  set -e
  test -f artisan
  test -f public/app/index.html
  php artisan down --retry=60
  php artisan optimize:clear
  php artisan migrate --force
  php artisan optimize
  php artisan up
  php artisan migrate:status
)
```

All migrations should show **Ran**, including `2026_10_03_000001_add_academic_management`. Open your site's `/api/health`; it should return `status: ok` and `database: connected`. Hard-refresh the browser with Ctrl+Shift+R.

If PHP OPcache is configured not to check changed files, reload the active PHP-FPM service. Determine its actual version on the VPS (the workflow's PHP 8.4 build version does not prove the VPS service name):

```bash
systemctl list-units --type=service --state=running 'php*-fpm.service'
# Replace VERSION with the version shown above, e.g. 8.4:
sudo systemctl reload phpVERSION-fpm
```

Nginx needs no reload for application-only updates. If its configuration changes, run `sudo nginx -t` before `sudo systemctl reload nginx`.

## Verify after the upgrade

1. Sign in as admin and check **Administration** and **Admin Panel → Manage System**.
2. Assign semesters to routines marked **Unassigned**.
3. Check drive links and upload/download a document and assignment attachment.
4. Add a quiz, topic and attendance record in the intended semester.
5. Sign in as a student in that semester; verify dashboard data and completion after a reload.

The PHP-FPM user must be able to write `storage` and `bootstrap/cache`. Server upload limits must allow the supported sizes (10 MB documents, 5 MB assignments). Existing public upload paths are preserved.

If deployment or migration fails, the workflow intentionally leaves maintenance enabled to avoid serving mixed code and schema. Read the failed Actions step and `storage/logs/laravel.log`, resolve the issue, and rerun the workflow before running `php artisan up`. Rollback drops the new academic tables and data; use a coordinated code/database backup for a full rollback instead of running rollback casually.
