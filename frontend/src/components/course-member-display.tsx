import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Space,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { FaEdit, FaTrashAlt, FaUserEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useDeleteCourseMembershipMutation } from "../redux/services/members-api";
import { CourseMemberData } from "../types/courses";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";
import CourseMemberRemoveConfirmation from "./course-member-remove-confirmation";

import UserProfileDisplay from "./user-profile-display";

type Props = {
  member: CourseMemberData;
  makeAdminOptionsAvailable: boolean;
};

function CourseMemberDisplay({ member, makeAdminOptionsAvailable }: Props) {
  const { courseId } = useParams();
  const membershipId = member.id;
  const [isRemoveMemberModalOpen, setRemoveMemberModalOpen] = useState(false);

  const resolveError = useResolveError();

  const [deleteCourseMember, { isLoading }] =
    useDeleteCourseMembershipMutation();

  const onDeleteCourseMember = async () => {
    if (isLoading || courseId === undefined) {
      return;
    }

    try {
      await deleteCourseMember({
        courseId,
        membershipId,
      }).unwrap();

      toastUtils.success({
        message: "The course has been successfully deleted.",
      });

      setRemoveMemberModalOpen(false);
    } catch (error) {
      resolveError(error);
    }
  };

  return (
    <>
      <Modal
        title="Remove member from course"
        opened={isRemoveMemberModalOpen}
        onClose={() => setRemoveMemberModalOpen(false)}
      >
        <CourseMemberRemoveConfirmation
          member={member}
          onSuccess={() => setRemoveMemberModalOpen(false)}
        />
      </Modal>
      <Group position="apart">
        <UserProfileDisplay {...member.user} />
        <Menu
          control={
            <ActionIcon>
              <FaEdit />
            </ActionIcon>
          }
          placement="end"
          hidden={!makeAdminOptionsAvailable}
        >
          <Menu.Item icon={<FaUserEdit />}>Edit role</Menu.Item>
          <Menu.Item
            icon={<FaTrashAlt color="red" />}
            onClick={() => setRemoveMemberModalOpen(true)}
          >
            Remove from course
          </Menu.Item>
        </Menu>
      </Group>
    </>
  );
}

export default CourseMemberDisplay;
