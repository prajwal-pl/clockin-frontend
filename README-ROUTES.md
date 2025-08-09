# Frontend Routes & Pages

- /(public)/auth/login – Sign in (email/password) + Google link
- /(public)/auth/register – Sign up
- /(app)/worker/clock – Worker location view and clock in/out
- /(app)/manager/dashboard – Metrics and active staff list
- /(app)/manager/perimeters – List perimeters with CRUD
- /(app)/manager/perimeters/new – Create perimeter with map polygon
- /(app)/manager/perimeters/[id] – Edit perimeter
- /(app)/manager/users/[id]/logs – View user logs

Notes

- Set NEXT_PUBLIC_API_BASE to your backend http://host:port/api
- All UI uses antd only; maps use react-leaflet + leaflet
