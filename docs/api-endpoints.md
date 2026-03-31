# API Endpoints (Frontend-facing)

Frontend memakai pola clean service layer; backend GAS memakai `resource` + `action`.

## Auth
- `POST /auth/login`
  - body: `{ email }`

## Users
- `GET /users`
- `POST /users` action=create
- `PUT /users` action=update (diimplement sebagai POST action=update)

## Patients
- `GET /patients?search=...`
- `POST /patients` action=create
- `PUT /patients` action=update

## Queue
- `GET /queue?status=&tanggal=&layanan=`
- `POST /queue` action=create
- `PUT /queue/status` action=update

## Examinations
- `GET /examinations?pasien_id=&antrian_id=`
- `POST /examinations` action=create
- `PUT /examinations` action=update

## Reminders
- `GET /reminders?status=&waktu=`
- `POST /reminders` action=create
- `PUT /reminders` action=update

## Finance
- `GET /finance?jenis=&kategori=&start_date=&end_date=`
- `POST /finance` action=create
- `PUT /finance` action=update

## Employees
- `GET /employees?status_aktif=`
- `POST /employees` action=create
- `PUT /employees` action=update

## Attendance
- `GET /attendance?karyawan_id=&status=&month=`
- `POST /attendance` action=create
- `PUT /attendance` action=update

## Reports
- `GET /reports?type=anc|partus|bidan|dokter|kecantikan|shk|imunisasi|kb`
- `POST /reports?type=...` action=create
- `PUT /reports?type=...` action=update

## Content
- `GET /content?type=hero|features|pricing|site_settings|footer|contact`
- `POST /content?type=...` action=create
- `PUT /content?type=...` action=update

## Response Standard

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "meta": {}
}
```
