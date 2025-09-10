Parking Lot Automation System

Overview
- Automates allocation, freeing, and querying of parking slots.
- Commands per spec: create, park, leave, status, and queries by color/registration.
- Supports file-based input and interactive shell.

Setup
- Requirements: Node.js 18+ (Linux/macOS), npm
- Bootstrap: `bin/setup`

Run
- Interactive: `bin/parking_lot`
- From file: `bin/parking_lot path/to/file_inputs.txt`

Commands
- `create_parking_lot <number_of_slots>` → `Created a parking lot with N slots`
- `park <registration_number> <car_color>` → nearest free slot or `Sorry, parking lot is full`
- `leave <slot_number>` → `Slot number X is free`
- `status` →
  Slot No. Registration No Colour
  1 KA-01-HH-1234 White
  2 KA-01-HH-9999 White
- `registration_numbers_for_cars_with_colour <color>` → comma-separated registrations
- `slot_numbers_for_cars_with_colour <color>` → comma-separated slot numbers
- `slot_number_for_registration_number <reg_number>` → slot number or `Not found`

Sample Input / Output
Input file:
  create_parking_lot 6
  park KA-01-HH-1234 White
  park KA-01-HH-9999 White
  park KA-01-BB-0001 Black
  park KA-01-HH-7777 Red
  park KA-01-HH-2701 Blue
  park KA-01-HH-3141 Black
  leave 4
  status

Output:
  Created a parking lot with 6 slots
  Allocated slot number: 1
  Allocated slot number: 2
  Allocated slot number: 3
  Allocated slot number: 4
  Allocated slot number: 5
  Allocated slot number: 6
  Slot number 4 is free
  Slot No. Registration No Colour
  1 KA-01-HH-1234 White
  2 KA-01-HH-9999 White
  3 KA-01-BB-0001 Black
  5 KA-01-HH-2701 Blue
  6 KA-01-HH-3141 Black

Development
- Build: `npm run build` (in `parking_lot/`)
- Test: `npm test` (in `parking_lot/`)

Docker (optional)
- Build: `docker build -t parking-lot ./parking_lot`
- Run (interactive): `docker run --rm -it parking-lot`

