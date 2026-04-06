import React from "react";
import { View } from "react-native";
import { Meta, StoryObj } from "@storybook/react";

import StoreProfile from "./StoreProfile";

const meta: Meta<typeof StoreProfile> = {
  title: "Organisms/StoreProfile",
  component: StoreProfile,
};

export default meta;

type Story = StoryObj<typeof StoreProfile>;

export const Default: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <StoreProfile storeId="dummy-store-id" />
    </View>
  ),
};