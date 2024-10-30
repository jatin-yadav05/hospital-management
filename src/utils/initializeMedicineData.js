import { db } from '../config/firebase';
import { collection, getDocs, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';

export const initializeMedicineData = async () => {
  const medicines = [
    {
      name: "Paracetamol 500mg",
      description: "Pain reliever and fever reducer",
      price: 49.99,
      category: "over-the-counter",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      stock: 100,
      brand: "HealthCare Plus",
      requiresPrescription: false,
      dosageForm: "Tablets",
      packSize: "10 tablets",
      usage: "For fever and mild pain",
      sideEffects: "May cause drowsiness",
      activeIngredients: ["Acetaminophen"]
    },
    {
      name: "Amoxicillin 250mg",
      description: "Antibiotic for bacterial infections",
      price: 299.99,
      category: "prescription",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      stock: 50,
      brand: "MediPharm",
      requiresPrescription: true,
      dosageForm: "Capsules",
      packSize: "20 capsules",
      usage: "For bacterial infections",
      sideEffects: "May cause nausea, diarrhea",
      activeIngredients: ["Amoxicillin"]
    },
    {
      name: "Vitamin D3 60000IU",
      description: "Weekly vitamin D supplement",
      price: 199.99,
      category: "vitamins",
      image: "https://images.unsplash.com/photo-1577904572082-4b271dcc17ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      stock: 75,
      brand: "VitaHealth",
      requiresPrescription: false,
      dosageForm: "Capsules",
      packSize: "4 capsules",
      usage: "Vitamin D deficiency",
      sideEffects: "None known",
      activeIngredients: ["Cholecalciferol"]
    },
    {
      name: "First Aid Kit",
      description: "Basic first aid supplies",
      price: 599.99,
      category: "first aid",
      image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      stock: 30,
      brand: "SafetyCare",
      requiresPrescription: false,
      packSize: "40 pieces",
      contents: ["Bandages", "Antiseptic wipes", "Gauze", "Medical tape"]
    },
    {
      name: "Digital Thermometer",
      description: "Accurate temperature measurement",
      price: 399.99,
      category: "health devices",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      stock: 25,
      brand: "TechMed",
      requiresPrescription: false,
      batteryLife: "1000 hours",
      features: ["LCD display", "Beeper", "Memory function"]
    },
    {
      name: "Baby Shampoo",
      description: "Gentle, tear-free formula",
      price: 149.99,
      category: "baby care",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      stock: 60,
      brand: "BabyCare",
      requiresPrescription: false,
      packSize: "200ml",
      features: ["No tears", "Hypoallergenic", "pH balanced"]
    }
  ];

  try {
    // First, delete all existing medicines
    const medicinesRef = collection(db, 'medicines');
    const snapshot = await getDocs(medicinesRef);
    
    // Delete existing documents
    const deletions = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletions);
    
    console.log('Cleared existing medicines');

    // Add new medicines
    for (const medicine of medicines) {
      await addDoc(collection(db, 'medicines'), {
        ...medicine,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Sample medicines data initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing medicines data:', error);
    throw error;
  }
}; 