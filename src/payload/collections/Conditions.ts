import type { CollectionConfig } from "payload";

// import { colorPickerField } from "@innovixx/payload-color-picker-field";

export const Conditions: CollectionConfig = {
  slug: "conditions",
  admin: {
    useAsTitle: "name",
  },
  labels: {
    singular: "Trouble du neurodéveloppement",
    plural: "Troubles du neurodéveloppement",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
      required: true,
    },
    {
      name: "acronym",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "textColor",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
    },

    // colorPickerField({
    //   name: "textColor",
    //   label: "Couleur du texte",
    //   required: true,
    //   admin: {
    //     description: "Choose a text color for the text",
    //   },
    //   defaultValue: "#161616",
    // }),
    // colorPickerField({
    //   name: "backgroundColor",
    //   label: "Couleur du fond",
    //   required: true,
    //   admin: {
    //     description: "Choose a background color for the text",
    //   },
    //   defaultValue: "#F6F6F6",
    // }),
  ],
};
