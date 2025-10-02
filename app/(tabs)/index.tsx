// app/(tabs)/index.tsx
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { useModules, type Module } from "../../context/ModulesContext";

export default function HomeScreen() {
  const router = useRouter();
  const { modules } = useModules();
  const goToNew = () => router.push("/module/new");

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0F" }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#A7A7B0", fontWeight: "700" }}>Your modules</Text>
        <Text style={{ color: "white", fontSize: 28, fontWeight: "900", marginTop: 6 }}>
          Plan. Track. Finish strong.
        </Text>
      </View>

      {modules.length === 0 ? (
        <View
          style={{
            marginHorizontal: 16,
            padding: 16,
            backgroundColor: "#12121A",
            borderRadius: 16,
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "800", textAlign: "center" }}>
            No modules yet
          </Text>
          <Text style={{ color: "#A7A7B0", marginTop: 8, textAlign: "center" }}>
            Create your first module to start tracking ECTS, grades, meetings and deadlines.
          </Text>
          <Pressable
            onPress={goToNew}
            style={{
              marginTop: 16,
              borderRadius: 28,
              paddingVertical: 16,
              alignItems: "center",
              backgroundColor: "#3B82F6",
            }}
            accessibilityRole="button"
            accessibilityLabel="Add your first module"
          >
            <Text style={{ color: "white", fontWeight: "800" }}>Add your first module</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={modules}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          renderItem={({ item }) => <ModuleCard item={item} />}
        />
      )}

      <Pressable
        onPress={goToNew}
        style={{
          position: "absolute",
          right: 20,
          bottom: 32,
          backgroundColor: "#2563EB",
          paddingVertical: 14,
          paddingHorizontal: 18,
          borderRadius: 28,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 4,
        }}
        accessibilityRole="button"
        accessibilityLabel="Add module"
      >
        <Text style={{ color: "white", fontWeight: "900" }}>Add module  +</Text>
      </Pressable>
    </View>
  );
}

function ModuleCard({ item }: { item: Module }) {
  return (
    <View
      style={{
        backgroundColor: "#12121A",
        borderColor: "#1F2937",
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>{item.name}</Text>
      {!!item.semester && <Text style={{ color: "#9CA3AF", marginTop: 2 }}>{item.semester}</Text>}
      <Text style={{ color: "#9CA3AF", marginTop: 6 }}>ECTS: {item.credits}</Text>
      <Text style={{ color: "#9CA3AF", marginTop: 2 }}>
        Wgt — Exam {item.weightings.exam}% · Project {item.weightings.project}% · Assess {item.weightings.assessments}% · Attend {item.weightings.attendance}%
      </Text>
    </View>
  );
}

// app/(tabs)/index.tsx

export default function HomeScreen() {
  const router = useRouter();
  const { modules } = useModules();
  const goToNew = () => router.push("/module/new");

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0F" }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#A7A7B0", fontWeight: "700" }}>Your modules</Text>
        <Text style={{ color: "white", fontSize: 28, fontWeight: "900", marginTop: 6 }}>
          Plan. Track. Finish strong.
        </Text>
      </View>

      {modules.length === 0 ? (
        <View style={{ marginHorizontal: 16, padding: 16, backgroundColor: "#12121A", borderRadius: 16 }}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "800", textAlign: "center" }}>No modules yet</Text>
          <Text style={{ color: "#A7A7B0", marginTop: 8, textAlign: "center" }}>
            Create your first module to start tracking ECTS, grades, meetings and deadlines.
          </Text>
          <Pressable
            onPress={goToNew}
            style={{ marginTop: 16, borderRadius: 28, paddingVertical: 16, alignItems: "center", backgroundColor: "#3B82F6" }}
            accessibilityRole="button"
            accessibilityLabel="Add your first module"
          >
            <Text style={{ color: "white", fontWeight: "800" }}>Add your first module</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={modules}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          renderItem={({ item }) => <ModuleCard item={item} />}
        />
      )}

      <Pressable
        onPress={goToNew}
        style={{
          position: "absolute",
          right: 20,
          bottom: 32,
          backgroundColor: "#2563EB",
          paddingVertical: 14,
          paddingHorizontal: 18,
          borderRadius: 28,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 4,
        }}
        accessibilityRole="button"
        accessibilityLabel="Add module"
      >
        <Text style={{ color: "white", fontWeight: "900" }}>Add module  +</Text>
      </Pressable>
    </View>
  );
}

function ModuleCard({ item }: { item: Module }) {
  return (
    <View
      style={{
        backgroundColor: "#12121A",
        borderColor: "#1F2937",
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>{item.name}</Text>
      {!!item.semester && <Text style={{ color: "#9CA3AF", marginTop: 2 }}>{item.semester}</Text>}
      <Text style={{ color: "#9CA3AF", marginTop: 6 }}>ECTS: {item.credits}</Text>
      <Text style={{ color: "#9CA3AF", marginTop: 2 }}>
        Wgt — Exam {item.weightings.exam}% · Project {item.weightings.project}% · Assess {item.weightings.assessments}% · Attend {item.weightings.attendance}%
      </Text>
    </View>
  );
}
