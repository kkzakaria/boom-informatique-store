import "dotenv/config"
import { PrismaClient } from '../lib/generated/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Créer des catégories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Ordinateurs Portables',
        slug: 'ordinateurs-portables',
        description: 'Ordinateurs portables pour toutes vos activités',
      }
    }),
    prisma.category.create({
      data: {
        name: 'Ordinateurs Fixes',
        slug: 'ordinateurs-fixes',
        description: 'Ordinateurs de bureau performants',
      }
    }),
    prisma.category.create({
      data: {
        name: 'Composants',
        slug: 'composants',
        description: 'Cartes graphiques, RAM, SSD et autres composants',
      }
    }),
    prisma.category.create({
      data: {
        name: 'Périphériques',
        slug: 'peripheriques',
        description: 'Souris, claviers, écrans et accessoires',
      }
    }),
    prisma.category.create({
      data: {
        name: 'Logiciels',
        slug: 'logiciels',
        description: 'Logiciels et licences pour votre productivité',
      }
    }),
  ])

  console.log('✅ Categories created:', categories.length)

  // Créer des produits
  const products = await Promise.all([
    // Ordinateurs Portables
    prisma.product.create({
      data: {
        name: 'MacBook Pro 16" M3',
        slug: 'macbook-pro-16-m3',
        description: 'Le MacBook Pro ultime avec puce M3, parfait pour les professionnels créatifs.',
        sku: 'MBP16-M3-001',
        price: 2699.99,
        comparePrice: 2999.99,
        stock: 15,
        minStock: 2,
        isActive: true,
        isFeatured: true,
        categoryId: categories[0].id,
        brand: 'Apple',
        warranty: '2 ans',
        images: {
          create: [
            {
              url: '/images/products/macbook-pro-16.jpg',
              alt: 'MacBook Pro 16" M3',
              isPrimary: true,
            }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Dell XPS 13',
        slug: 'dell-xps-13',
        description: 'Ultrabook premium avec écran InfinityEdge et processeur Intel Core i7.',
        sku: 'DXPS13-001',
        price: 1299.99,
        stock: 25,
        minStock: 3,
        isActive: true,
        isFeatured: true,
        categoryId: categories[0].id,
        brand: 'Dell',
        warranty: '2 ans',
        images: {
          create: [
            {
              url: '/images/products/dell-xps-13.jpg',
              alt: 'Dell XPS 13',
              isPrimary: true,
            }
          ]
        }
      }
    }),
    // Ordinateurs Fixes
    prisma.product.create({
      data: {
        name: 'Gaming PC RTX 4070',
        slug: 'gaming-pc-rtx-4070',
        description: 'PC gaming haute performance avec RTX 4070 et processeur AMD Ryzen 7.',
        sku: 'GPC-RTX4070-001',
        price: 1899.99,
        stock: 8,
        minStock: 1,
        isActive: true,
        isFeatured: true,
        categoryId: categories[1].id,
        brand: 'Custom Build',
        warranty: '3 ans',
        images: {
          create: [
            {
              url: '/images/products/gaming-pc-rtx4070.jpg',
              alt: 'Gaming PC RTX 4070',
              isPrimary: true,
            }
          ]
        }
      }
    }),
    // Composants
    prisma.product.create({
      data: {
        name: 'NVIDIA GeForce RTX 4070',
        slug: 'nvidia-geforce-rtx-4070',
        description: 'Carte graphique haut de gamme pour gaming et création de contenu.',
        sku: 'RTX4070-001',
        price: 699.99,
        stock: 12,
        minStock: 2,
        isActive: true,
        categoryId: categories[2].id,
        brand: 'NVIDIA',
        warranty: '3 ans',
        images: {
          create: [
            {
              url: '/images/products/rtx-4070.jpg',
              alt: 'NVIDIA GeForce RTX 4070',
              isPrimary: true,
            }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Corsair Vengeance LPX 32GB',
        slug: 'corsair-vengeance-lpx-32gb',
        description: 'Kit de mémoire DDR4 32GB (2x16GB) 3200MHz pour performances optimales.',
        sku: 'CVLPX32GB-001',
        price: 149.99,
        stock: 30,
        minStock: 5,
        isActive: true,
        categoryId: categories[2].id,
        brand: 'Corsair',
        warranty: '10 ans',
        images: {
          create: [
            {
              url: '/images/products/corsair-ram-32gb.jpg',
              alt: 'Corsair Vengeance LPX 32GB',
              isPrimary: true,
            }
          ]
        }
      }
    }),
    // Périphériques
    prisma.product.create({
      data: {
        name: 'Logitech MX Master 3S',
        slug: 'logitech-mx-master-3s',
        description: 'Souris ergonomique sans fil avec connectivité multi-appareils.',
        sku: 'LMX3S-001',
        price: 129.99,
        stock: 20,
        minStock: 3,
        isActive: true,
        categoryId: categories[3].id,
        brand: 'Logitech',
        warranty: '2 ans',
        images: {
          create: [
            {
              url: '/images/products/logitech-mx-master-3s.jpg',
              alt: 'Logitech MX Master 3S',
              isPrimary: true,
            }
          ]
        }
      }
    }),
    // Logiciels
    prisma.product.create({
      data: {
        name: 'Microsoft Office 365 Personnel',
        slug: 'microsoft-office-365-personnel',
        description: 'Suite bureautique complète avec Word, Excel, PowerPoint et Outlook.',
        sku: 'MO365P-001',
        price: 69.99,
        stock: 999, // Logiciels - stock virtuel
        minStock: 10,
        isActive: true,
        categoryId: categories[4].id,
        brand: 'Microsoft',
        warranty: 'Licence perpétuelle',
        images: {
          create: [
            {
              url: '/images/products/office-365.jpg',
              alt: 'Microsoft Office 365 Personnel',
              isPrimary: true,
            }
          ]
        }
      }
    }),
  ])

  console.log('✅ Products created:', products.length)

  // Créer un utilisateur admin pour les tests
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin Boom Informatique',
      email: 'admin@boominformatique.com',
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeCt1uB0YEv8HRRpO', // "admin123"
      role: 'ADMIN',
    }
  })

  console.log('✅ Admin user created:', adminUser.email)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })