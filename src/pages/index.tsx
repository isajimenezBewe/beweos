import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Badge } from "@heroui/badge";
import { Avatar } from "@heroui/avatar";
import { useTheme } from "../hooks/useTheme";

export default function IndexPage() {
  const { theme, currentColor, currentMode } = useTheme();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Theme Showcase
        </h1>
        <p className="text-default-500">
          Currently using <span className="font-semibold capitalize text-primary">{currentColor}</span> theme in <span className="font-semibold">{currentMode}</span> mode
        </p>
        <p className="text-xs text-default-400 mt-2">
          Active theme: <code className="bg-content2 px-2 py-1 rounded">{theme}</code>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Buttons Card */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Buttons</h3>
          </CardHeader>
          <Divider />
          <CardBody className="gap-3">
            <Button color="primary">Primary Button</Button>
            <Button color="primary" variant="bordered">Bordered</Button>
            <Button color="primary" variant="light">Light</Button>
            <Button color="primary" variant="flat">Flat</Button>
            <Button color="primary" variant="ghost">Ghost</Button>
            <Button color="primary" variant="shadow">Shadow</Button>
          </CardBody>
        </Card>

        {/* Chips Card */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Chips</h3>
          </CardHeader>
          <Divider />
          <CardBody className="gap-3">
            <div className="flex flex-wrap gap-2">
              <Chip color="primary">Primary</Chip>
              <Chip color="primary" variant="bordered">Bordered</Chip>
              <Chip color="primary" variant="light">Light</Chip>
              <Chip color="primary" variant="flat">Flat</Chip>
              <Chip color="primary" variant="shadow">Shadow</Chip>
            </div>
          </CardBody>
        </Card>

        {/* Badges Card */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Badges</h3>
          </CardHeader>
          <Divider />
          <CardBody className="gap-3">
            <div className="flex gap-4">
              <Badge content="5" color="primary">
                <Avatar
                  radius="lg"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </Badge>
              <Badge content="New" color="primary" variant="flat">
                <Avatar
                  radius="lg"
                  src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                />
              </Badge>
            </div>
          </CardBody>
        </Card>

        {/* Color Test Card */}
        <Card className="col-span-full">
          <CardHeader>
            <h3 className="text-lg font-semibold">Theme Colors</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="w-full h-20 bg-primary rounded-lg" />
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-default-400">bg-primary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-background border border-divider rounded-lg" />
                <p className="text-sm font-medium">Background</p>
                <p className="text-xs text-default-400">bg-background</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-content1 border border-divider rounded-lg" />
                <p className="text-sm font-medium">Content 1</p>
                <p className="text-xs text-default-400">bg-content1</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-content2 border border-divider rounded-lg" />
                <p className="text-sm font-medium">Content 2</p>
                <p className="text-xs text-default-400">bg-content2</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
