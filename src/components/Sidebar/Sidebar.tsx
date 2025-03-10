// import { SignOutButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Sidebar = async () => {
  const session = await currentUser();
  const role = session?.publicMetadata.role as string;

  const menuItems = [
    {
      title: 'MENU',
      items: [
        {
          icon: '/home.png',
          label: 'Home',
          href: `/${role}`,
          visible: ['admin', 'teacher', 'student', 'parent'],
        },
        {
          icon: '/teacher.png',
          label: 'Teachers',
          href: '/list/teachers',
          visible: ['admin', 'teacher'],
        },
        {
          icon: '/student.png',
          label: 'Students',
          href: '/list/students',
          visible: ['admin', 'teacher'],
        },
        {
          icon: '/parent.png',
          label: 'Parents',
          href: '/list/parents',
          visible: ['admin', 'teacher'],
        },
        {
          icon: '/subject.png',
          label: 'Subjects',
          href: '/list/subjects',
          visible: ['admin'],
        },
        {
          icon: '/class.png',
          label: 'Classes',
          href: '/list/classes',
          visible: ['admin', 'teacher'],
        },
        {
          icon: '/lesson.png',
          label: 'Lessons',
          href: '/list/lessons',
          visible: ['admin', 'teacher'],
        },
        {
          icon: '/exam.png',
          label: 'Exams',
          href: '/list/exams',
          visible: ['admin', 'teacher', 'student', 'parent'],
        },
        {
          icon: '/assignment.png',
          label: 'Assignments',
          href: '/list/assignments',
          visible: ['admin', 'teacher', 'student', 'parent'],
        },
        {
          icon: '/result.png',
          label: 'Results',
          href: '/list/results',
          visible: ['admin', 'teacher', 'student', 'parent'],
        },
        {
          icon: '/attendance.png',
          label: 'Attendances',
          href: '/list/attendances',
          visible: ['admin', 'teacher', 'student', 'parent'],
        },
        {
          icon: '/calendar.png',
          label: 'Events',
          href: '/list/events',
          visible: ['admin', 'teacher', 'student', 'parent'],
        },
        {
          icon: '/message.png',
          label: 'Messages',
          href: '/list/messages',
          visible: ['admin', 'teacher', 'student', 'parent'],
        },
        {
          icon: '/announcement.png',
          label: 'Announcements',
          href: '/list/announcements',
          visible: ['admin', 'teacher', 'student', 'parent'],
        },
      ],
    },
    {
      title: 'OTHER',
      items: [
        {
          icon: '/profile.png',
          label: 'Profile',
          href: '/profile',
          visible: ['admin', 'teacher', 'student', 'parent'],
        },
        {
          icon: '/setting.png',
          label: 'Settings',
          href: '/settings',
          visible: ['admin', 'teacher', 'student', 'parent'],
        },
        // {
        //   icon: '/logout.png',
        //   label: <SignOutButton redirectUrl="/sign-in" />,
        //   href: '/sign-in',
        //   visible: ['admin', 'teacher', 'student', 'parent'],
        // },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-2 px-0 py-6 lg:px-2 lg:py-2">
      {menuItems.map((item, index) => (
        <div key={index} className="flex flex-col gap-1">
          <h3 className="hidden text-sm font-medium text-gray-400 lg:block">
            {item.title}
          </h3>
          <ul className="flex flex-col gap-3 lg:gap-0.5">
            {item.items.map((subItem, subIndex) => {
              if (subItem.visible.includes(role)) {
                return (
                  <Link
                    href={subItem.href}
                    key={subIndex}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-md px-1 py-1 hover:bg-sky-100 lg:justify-start"
                  >
                    <Image
                      src={subItem.icon}
                      alt={subItem.label}
                      width={14}
                      height={14}
                    />
                    <p className="hidden text-xs text-gray-600 lg:block">
                      {subItem.label}
                    </p>
                  </Link>
                );
              }
            })}
          </ul>
        </div>
      ))}
      {/* <div className="-mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-md px-1 py-1 hover:bg-sky-100 lg:justify-start">
        <Image src="/logout.png" alt="logout" width={14} height={14} />
        <p className="hidden text-xs text-gray-600 lg:block">
          <SignOutButton redirectUrl="/sign-in" />
        </p>
      </div> */}
    </div>
  );
};

export default Sidebar;
