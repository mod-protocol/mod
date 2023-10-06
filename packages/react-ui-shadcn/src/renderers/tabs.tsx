import React from "react";
import { Renderers } from "@mod-protocol/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

export const TabsRenderer = (
  props: React.ComponentProps<Renderers["Tabs"]>
) => {
  const { values, names, children, onChange } = props;

  return (
    <Tabs defaultValue={values[0]} className="w-full flex">
      <TabsList className="grid w-full grid-cols-2">
        {values.map((value, index) => (
          <TabsTrigger
            key={value}
            value={value}
            onClick={() => onChange(value)}
          >
            {names[index]}
          </TabsTrigger>
        ))}
      </TabsList>
      {values.map((value) => (
        <TabsContent key={value} value={value}>
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
};
