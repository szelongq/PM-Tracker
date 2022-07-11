import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Drawer,
  Group,
  ScrollArea,
  SimpleGrid,
  Stack,
  Title,
} from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import pluralize from "pluralize";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { ImFilesEmpty } from "react-icons/im";
import { Link } from "react-router-dom";
import { capitalCase } from "change-case";
import { Role } from "../../types/courses";
import RoleRestrictedWrapper from "../role-restricted-wrapper";
import PlaceholderWrapper from "../placeholder-wrapper";
import { useGetMilestonesQuery } from "../../redux/services/milestones-api";
import { useResolveError } from "../../utils/error-utils";
import { useGetMilestoneAlias } from "../../custom-hooks/use-get-milestone-alias";
import MilestoneCard from "../milestone-card";
import { useGetCourseId } from "../../custom-hooks/use-get-course-id";
import MilestoneCreationForm from "../milestone-creation-form";

function CourseMilestonesPage() {
  const courseId = useGetCourseId();
  const {
    data: milestones,
    isLoading,
    error,
  } = useGetMilestonesQuery(courseId ?? skipToken);
  useResolveError(error);
  const milestoneAlias = useGetMilestoneAlias();
  const [isDrawerOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={isDrawerOpened}
        onClose={close}
        position="right"
        size="xl"
        padding="lg"
        closeButtonLabel={`Cancel ${milestoneAlias} creation`}
        title={<Title order={2}>{capitalCase(milestoneAlias)} Creation</Title>}
      >
        <ScrollArea offsetScrollbars pr="xs" scrollbarSize={8}>
          <MilestoneCreationForm onSuccess={close} />
        </ScrollArea>
      </Drawer>

      <Stack>
        <RoleRestrictedWrapper allowedRoles={[Role.CoOwner, Role.Instructor]}>
          <Group position="right">
            <Button
              color="teal"
              leftIcon={<MdOutlineLibraryAdd />}
              onClick={open}
            >
              Create new {milestoneAlias}
            </Button>
            <Button<typeof Link>
              component={Link}
              to="../templates"
              leftIcon={<ImFilesEmpty />}
            >
              {capitalCase(milestoneAlias)} templates
            </Button>
          </Group>
        </RoleRestrictedWrapper>

        <PlaceholderWrapper
          isLoading={isLoading}
          py={150}
          loadingMessage={`Loading ${pluralize(milestoneAlias)}...`}
          defaultMessage={`No ${pluralize(milestoneAlias)} found`}
          showDefaultMessage={!milestones || milestones.length === 0}
        >
          <SimpleGrid cols={3} spacing="xs">
            {milestones?.map((milestone) => (
              <MilestoneCard key={milestone.id} {...milestone} />
            ))}
          </SimpleGrid>
        </PlaceholderWrapper>
      </Stack>
    </>
  );
}

export default CourseMilestonesPage;
