import { PrismaClient, RoleName } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Users (Admins and Customers)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@arrehlah.com' },
    update: {},
    create: {
      email: 'admin@arrehlah.com',
      firstName: 'Super',
      lastName: 'Admin',
      role: RoleName.SUPER_ADMIN,
    },
  })

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: RoleName.CUSTOMER,
      phone: '+2348012345678'
    },
  })

  // 2. Create Destinations
  const destinationDubai = await prisma.destination.upsert({
    where: { slug: 'dubai-uae' },
    update: {},
    create: {
      name: 'Dubai, UAE',
      slug: 'dubai-uae',
      country: 'United Arab Emirates',
      description: 'Experience the luxury of Dubai',
      isActive: true,
    }
  })

  const destinationMakkah = await prisma.destination.upsert({
    where: { slug: 'makkah-saudi' },
    update: {},
    create: {
      name: 'Makkah, Saudi Arabia',
      slug: 'makkah-saudi',
      country: 'Saudi Arabia',
      description: 'The Holy City of Makkah',
      isActive: true,
    }
  })

  // 3. Create Visa Services
  const uaeVisa = await prisma.visaService.upsert({
    where: { country_visaType: { country: 'United Arab Emirates', visaType: 'Tourist 30 Days' } },
    update: {},
    create: {
      country: 'United Arab Emirates',
      visaType: 'Tourist 30 Days',
      processingTime: '2-3 working days',
      serviceFee: 150000,
      isActive: true,
      isFeatured: true
    }
  })

  // 4. Create some Bookings
  // Check if booking already exists to avoid duplicates on multiple seed runs
  const existingBooking = await prisma.booking.findUnique({
    where: { reference: 'ARR-2026-DEMO1' }
  })

  if (!existingBooking) {
    const booking = await prisma.booking.create({
      data: {
        reference: 'ARR-2026-DEMO1',
        userId: customer1.id,
        status: 'CONFIRMED',
        totalAmount: 150000,
        currency: 'NGN',
        items: {
          create: [
            {
              serviceType: 'VISA',
              amount: 150000,
            }
          ]
        },
        payments: {
          create: [
            {
              userId: customer1.id,
              amount: 150000,
              currency: 'NGN',
              provider: 'PAYSTACK',
              reference: 'PAY-DEMO-1234',
              status: 'PAID',
              verifiedAt: new Date()
            }
          ]
        }
      }
    })

    // 5. Create specific Visa Application linked to the booking
    await prisma.visaApplication.create({
      data: {
        reference: 'VISA-DEMO-1',
        userId: customer1.id,
        destination: 'United Arab Emirates',
        visaType: 'Tourist 30 Days',
        status: 'APPROVED',
        serviceFee: 150000,
      }
    })
    
    console.log(`Created mock booking: ${booking.reference}`)
  }

  console.log('Seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
