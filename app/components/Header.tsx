import { Heading, Flex, Text, Code, Skeleton } from "@radix-ui/themes";

interface HeaderProps {
  ip: string;
  loading: boolean;
  error: Error | null;
}

export const Header = ({ ip, loading, error }: HeaderProps) => {
  return (
    <>
      <Heading size={{ initial: "7", md: "8" }} align="center">
        真实地址生成器 🌍
      </Heading>
      <Flex gap="2" align="center" wrap="wrap" justify="center">
        <Text size="4" color="gray">
          您的当前 IP 地址为：
        </Text>
        {loading ? (
          <Skeleton>
            <Code size="4">loading...</Code>
          </Skeleton>
        ) : error ? (
          <Text color="red">获取 IP 失败，可手动输入 IP</Text>
        ) : (
          <Code size="4">{ip}</Code>
        )}
      </Flex>
    </>
  );
};
