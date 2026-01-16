// analyzeEmissions.ts
// Run with: npx tsx analyzeEmissions.ts

import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBIvTUeN-I9FnCgz7d0ybhdWRpwsyFH0_s",
  authDomain: "fg-react-app.firebaseapp.com",
  databaseURL: "https://fg-react-app-default-rtdb.firebaseio.com",
  projectId: "fg-react-app",
  storageBucket: "fg-react-app.appspot.com",
  messagingSenderId: "489135632905",
  appId: "1:489135632905:web:20779662c09acf532a3ed8",
  measurementId: "G-SQGC08TMY4"
};

console.log("🔥 Initializing Firebase...");
console.log(`Project ID: ${firebaseConfig.projectId}\n`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface UserDetail {
  userId: string;
  name: string;
  email: string;
  count: number;
  months: string[];
  firstEmission: number;
  lastEmission: number;
  reduction: number;
}

async function analyzeEmissions() {
  console.log("🚀 Starting analysis...\n");

  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    let totalUsers = 0;
    let usersWithEmissions = 0;
    let usersWithMultiple = 0;
    let usersWithReductions = 0;
    let totalOrganicReduction = 0;
    let maxDocs = 0;
    const userDetails: UserDetail[] = [];

    console.log(`📊 Found ${usersSnapshot.size} total users\n`);

    const startTime = Date.now();

    for (const userDoc of usersSnapshot.docs) {
      totalUsers++;
      const userId = userDoc.id;
      const userData = userDoc.data();

      // Get user info
      const name = userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown';
      const email = userData.emailAddress || userData.email || 'No email';

      const emissionsRef = collection(db, "users", userId, "emissions");
      const emissionsSnapshot = await getDocs(emissionsRef);

      const count = emissionsSnapshot.size;
      const months = emissionsSnapshot.docs.map(doc => doc.id).sort();

      if (count > 0) {
        usersWithEmissions++;
        
        if (count > 1) {
          usersWithMultiple++;
          
          // Get first and last emissions
          const firstDoc = emissionsSnapshot.docs.find(doc => doc.id === months[0]);
          const lastDoc = emissionsSnapshot.docs.find(doc => doc.id === months[months.length - 1]);

          const firstEmission = firstDoc?.data()?.totalEmissions || 0;
          const lastEmission = lastDoc?.data()?.totalEmissions || 0;
          
          // Only include users with VALID emissions (both > 0)
          if (firstEmission > 0 && lastEmission > 0) {
            const reduction = firstEmission - lastEmission;
            
            // Only count as reduction if it's positive
            if (reduction > 0) {
              usersWithReductions++;
              totalOrganicReduction += reduction;
              
              userDetails.push({
                userId,
                name,
                email,
                count,
                months,
                firstEmission,
                lastEmission,
                reduction
              });
            }
          }
        }
        
        if (count > maxDocs) {
          maxDocs = count;
        }
      }

      // Progress indicator
      if (totalUsers % 10 === 0 || totalUsers === usersSnapshot.size) {
        const progress = ((totalUsers / usersSnapshot.size) * 100).toFixed(1);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        process.stdout.write(
          `\r🔄 Progress: ${totalUsers}/${usersSnapshot.size} (${progress}%) | ` +
          `Reductions Found: ${usersWithReductions} | Elapsed: ${elapsed}s`
        );
      }
    }

    console.log('\n\n');

    // Results
    console.log("=".repeat(80));
    console.log("📈 ANALYSIS RESULTS");
    console.log("=".repeat(80));
    console.log(`Total Users:                    ${totalUsers}`);
    console.log(`Users with Emissions:           ${usersWithEmissions}`);
    console.log(`Users Tracking Multiple Months: ${usersWithMultiple}`);
    console.log(`Users with Valid Reductions:    ${usersWithReductions}`);
    console.log(`\n🌱 TOTAL ORGANIC CO₂ REDUCTION:  ${totalOrganicReduction.toFixed(2)} TONS`);
    
    const percentage = usersWithEmissions > 0 
      ? ((usersWithMultiple / usersWithEmissions) * 100).toFixed(1) 
      : "0.0";
    console.log(`Percentage Tracking Over Time:  ${percentage}%`);

    // Top reducers
    console.log("\n" + "-".repeat(80));
    console.log("🌱 TOP 10 USERS WITH BIGGEST CO₂ REDUCTIONS");
    console.log("-".repeat(80));
    
    const topReducers = userDetails
      .sort((a, b) => b.reduction - a.reduction)
      .slice(0, 10);

    if (topReducers.length > 0) {
      topReducers.forEach((user, i) => {
        const percentReduction = ((user.reduction / user.firstEmission) * 100).toFixed(1);
        console.log(`\n${i + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   First:  ${user.firstEmission.toFixed(2)} tons (${user.months[0]})`);
        console.log(`   Last:   ${user.lastEmission.toFixed(2)} tons (${user.months[user.months.length - 1]})`);
        console.log(`   🎉 Reduced: ${user.reduction.toFixed(2)} tons (${percentReduction}% reduction)`);
        console.log(`   Tracking: ${user.count} months`);
      });
    } else {
      console.log("\n❌ No users with valid reductions found.");
      console.log("   (Users need 2+ months with emissions > 0 and a decrease)");
    }

    // Distribution
    console.log("\n" + "-".repeat(80));
    console.log("📊 TRACKING DISTRIBUTION");
    console.log("-".repeat(80));
    
    const dist: Record<number, number> = {};
    if (usersWithEmissions > 0) {
      // Count all users with emissions for distribution
      const usersSnapshotForDist = await getDocs(usersRef);
      for (const userDoc of usersSnapshotForDist.docs) {
        const emissionsRef = collection(db, "users", userDoc.id, "emissions");
        const emissionsSnapshot = await getDocs(emissionsRef);
        const count = emissionsSnapshot.size;
        if (count > 0) {
          dist[count] = (dist[count] || 0) + 1;
        }
      }

      Object.keys(dist).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
        const count = parseInt(key);
        const users = dist[count];
        const percentage = (users / usersWithEmissions) * 100;
        const bar = "█".repeat(Math.min(50, Math.floor(percentage)));
        console.log(`${count.toString().padStart(2)} docs: ${users.toString().padStart(4)} users (${percentage.toFixed(1)}%) ${bar}`);
      });
    }

    // Summary box
    console.log("\n" + "=".repeat(80));
    console.log("🎯 ADD THIS TO FIREBASE");
    console.log("=".repeat(80));
    console.log(`\nGo to: Firebase Console > Firestore > community > emissions_stats`);
    console.log(`\nAdd/Update these fields:`);
    console.log(`  organic_reductions: ${totalOrganicReduction.toFixed(2)}`);
    console.log(`  users_with_reductions: ${usersWithReductions}`);
    console.log(`\nThis represents ${totalOrganicReduction.toFixed(2)} tons of CO₂ reduced through`);
    console.log(`behavior change by ${usersWithReductions} users! 🌱`);
    console.log("=".repeat(80) + "\n");
    
    return {
      totalUsers,
      usersWithEmissions,
      usersWithMultiple,
      usersWithReductions,
      totalOrganicReduction,
      maxDocs,
      userDetails
    };
  } catch (error) {
    console.error("\n❌ Error during analysis:", error);
    throw error;
  }
}

// Run it
analyzeEmissions()
  .then(() => {
    console.log("✅ Analysis complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });