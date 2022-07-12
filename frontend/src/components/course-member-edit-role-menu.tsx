import { Button, Group, Radio, RadioGroup, Space } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { capitalize } from "lodash";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ROLE } from "../constants";
import { useGetSingleCourseQuery } from "../redux/services/courses-api";
import { useUpdateCourseMembershipMutation } from "../redux/services/members-api";
import {
  CourseMemberData,
  editableRoleMap,
  Role,
  roles,
} from "../types/courses";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";

type Props = {
  member: CourseMemberData;
  onSuccess?: () => void;
};

function CourseMemberEditRoleMenu({ member, onSuccess }: Props) {
  const [memberRole, setMemberRole] = useState(member.role);

  const { courseId } = useParams();
  const { course } = useGetSingleCourseQuery(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ course }),
  });
  const editableRoles = editableRoleMap.get(course?.role) || new Set<Role>();

  const membershipId = member.id;

  const resolveError = useResolveError();

  const [updateCourseMemberRole, { isLoading }] =
    useUpdateCourseMembershipMutation();

  const onUpdateCourseMemberRole = async () => {
    if (isLoading || courseId === undefined) {
      return;
    }

    const updateCourseMembershipData = {
      [ROLE]: memberRole,
    };

    try {
      await updateCourseMemberRole({
        courseId,
        membershipId,
        ...updateCourseMembershipData,
      }).unwrap();

      toastUtils.success({
        message: "The member's role has been successfully updated.",
      });

      onSuccess?.();
    } catch (error) {
      resolveError(error);
    }
  };

  return (
    <>
      <RadioGroup
        value={memberRole}
        onChange={(value: string) => {
          try {
            const selectedRole = value as Role;
            setMemberRole(selectedRole);
          } catch {
            setMemberRole(memberRole);
          }
        }}
      >
        {roles.map((role) => {
          const roleString = capitalize(role.toLowerCase());
          return (
            <Radio
              value={role}
              label={roleString}
              disabled={!editableRoles.has(role)}
            />
          );
        })}
      </RadioGroup>
      <Space h="md" />
      <Group position="right">
        <Button color="gray" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          loading={isLoading}
          onClick={onUpdateCourseMemberRole}
        >
          Save changes
        </Button>
      </Group>
    </>
  );
}

export default CourseMemberEditRoleMenu;
