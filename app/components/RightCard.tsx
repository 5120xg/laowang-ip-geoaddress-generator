import { Card, Text, Flex, Separator } from "@radix-ui/themes";
import { UserInfo } from "./UserInfo";
import { AddressInfo } from "./AddressInfo";
import type { User, Address } from "../types";

interface RightCardProps {
  user: User | null;
  address: Address | null;
  isLoading: boolean;
  error: string;
  email: string;
  emailLoading: boolean;
  emailError: string;
}

export const RightCard = ({
  user,
  address,
  isLoading,
  error,
  email,
  emailLoading,
  emailError,
}: RightCardProps) => {
  return (
    <Card size={{ initial: "2", md: "4" }} style={{ flex: 1 }} className="w-full">
      <Flex direction="column" gap="3">
        {error && (
          <Text color="red" size="2">
            {error}
          </Text>
        )}
        <UserInfo
          user={user}
          loading={isLoading}
          email={email}
          emailLoading={emailLoading}
          emailError={emailError}
        />
        <Separator size="4" />
        <AddressInfo address={address} loading={isLoading} />
      </Flex>
    </Card>
  );
};
