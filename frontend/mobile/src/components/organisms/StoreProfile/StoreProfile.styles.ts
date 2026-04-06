import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  profile: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },

  owner: {
    color: "#666",
  },

  badge: {
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },

  badgeText: {
    color: "#1B8E3E",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 16,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  label: {
    color: "#888",
    marginTop: 10,
  },

  map: {
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },

  button: {
    backgroundColor: "#FDE8DC",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    textAlign: "center",
    color: "#D2691E",
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  logout: {
    margin: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
  },

  logoutText: {
    textAlign: "center",
    color: "red",
  },
});