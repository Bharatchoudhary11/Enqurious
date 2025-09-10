Parking Lot Automation System (TypeScript)

Overview
- Simple automated ticketing system for a parking lot.
- Supports file-based input and interactive shell.
- Clean TypeScript code with unit tests.

Key Commands (as per spec)
- `create_parking_lot <number_of_slots>`
- `park <registration_number> <car_color>`
- `leave <slot_number>`
- `status`
- `registration_numbers_for_cars_with_colour <color>`
- `slot_numbers_for_cars_with_colour <color>`
- `slot_number_for_registration_number <reg_number>`

Project Structure
- CLI entry: `bin/parking_lot`
- Setup script: `bin/setup`
- App command handler: `src/app.ts`
- Simple domain model: `src/domain/simple.ts`
- Additional services (not used by CLI): `src/services/*`
- Tests: `test/parkingLot.spec.ts` (Vitest)
- Sample input: `file_inputs.txt`

Setup & Run
- Setup (installs, builds, tests): `bin/setup`
- File mode: `bin/parking_lot file_inputs.txt`
- Interactive mode: `bin/parking_lot` (type commands, end with `quit`)

Local Development
1) Install deps: `npm install`
2) Build: `npm run build`
3) Tests: `npm test`
4) Run (file): `bin/parking_lot file_inputs.txt`
5) Run (interactive): `bin/parking_lot`

Docker
- Build image: `docker build -t parking-lot .`
- Run with file: `docker run --rm -it -v "$PWD/file_inputs.txt:/app/file_inputs.txt:ro" parking-lot file_inputs.txt`
- Run interactively: `docker run --rm -it parking-lot`
- Notes:
  - The Docker build runs tests; it fails if tests fail.
  - Final image contains only runtime artifacts (`dist/` + `bin/`).

