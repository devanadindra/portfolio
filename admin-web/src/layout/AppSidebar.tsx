import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, Variants } from "framer-motion"; // Import Framer Motion
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { LuUserPlus } from "react-icons/lu";
import { CiBoxes } from "react-icons/ci";
import { useModalStatus } from "../context/ModalContext";
import { useConfirmModal } from "../context/ConfirmModalContext";
import { logoutUser } from "../services/userService";
import { handleNavigate } from "../utils/navigationHelper";
import { useAlert } from "../context/AlertContext";
import { useLoading } from "../context/LoadingContext";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { MdOutlinePayments } from "react-icons/md";

const logoContainerVariants: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.05,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 2.5,
            duration: 0.01
        },
    },
};

const logoItemVariants: Variants = {
    // Posisi awal (tidak terlihat)
    initial: { 
        opacity: 0, 
        y: 10, 
        transition: { duration: 0.3 } 
    },
    // Posisi stabil (terlihat)
    animate: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            type: "spring", 
            stiffness: 100, 
            damping: 10 
        } 
    },
};

const AnimatedLogoText: React.FC<{ text: string }> = ({ text }) => {
    const letters = Array.from(text);

    return (
        <motion.div
            className="text-2xl font-black text-gray-900 dark:text-white flex whitespace-nowrap overflow-hidden"
            variants={logoContainerVariants}
            initial="initial"
            animate="animate"
            key="animated-logo" 
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    // Pertahankan spasi dengan margin atau style
                    style={letter === ' ' ? { display: 'inline-block', width: '0.4em' } : {}}
                    variants={logoItemVariants}
                >
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    );
};

// --- Tipe dan Data Navigasi (Tidak Berubah) ---

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/home",
  },
  {
    icon: <CiBoxes />,
    name: "Products",
    path: "/product",
  },
  {
    icon: <HiOutlineClipboardDocumentList />,
    name: "Orders",
    path: "/order",
  },
  {
    icon: <MdOutlinePayments />,
    name: "Payments",
    path: "/payment",
  },
  {
    icon: <LuUserPlus />,
    name: "Create Account",
    path: "/signup",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
];

// --- Komponen Utama AppSidebar ---

const AppSidebar: React.FC = () => {
  const {
    isMobile,
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    setIsMobileOpen,
  } = useSidebar();
  const navigate = useNavigate();
  const { openStatusModal } = useModalStatus();
  const { openConfirmModal } = useConfirmModal();
  const { setLoading } = useLoading();
  const { showAlert } = useAlert();

  const handleLinkClick = () => {
    if (isMobile && isMobileOpen) {
      setIsMobileOpen(false);
    }
  };
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) =>
      location.pathname === path || location.pathname.startsWith(path + "/"),
    [location.pathname]
  );

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const handleLogoutConfirm = async () => {
    try {
      const data = await logoutUser();
      if (!data.errors) {
        openStatusModal({
          status: "success",
          title: "Logout Success",
          message: "Goodbye, see you later!",
          onCloseCallback: () =>
            handleNavigate(navigate, "/", undefined, setLoading, true, true),
        });
      } else {
        showAlert("error", "Error", `${data.errors}`);
      }
    } catch (err) {
      showAlert("error", "Error", `Something went wrong ${err}`);
    }
  };

  const handleLogout = () => {
    openConfirmModal({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      onConfirm: handleLogoutConfirm,
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                onClick={handleLinkClick}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } ${
                  !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      onClick={handleLinkClick}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "justify-center" : "justify-start" 
        }`}
      >
        <button onClick={handleLinkClick} className="flex items-center">
          {isExpanded || isHovered || isMobileOpen ? (
            <AnimatedLogoText text="No Time to Hell" />
          ) : (
            <div className="text-xl font-black text-gray-900 dark:text-white transition-all duration-300">
              NTH
            </div>
          )}
        </button>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            
            {/* TOMBOL SIGN OUT (Sudah Diperbaiki) */}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-4 py-2 text-gray-700 rounded-lg font-medium text-theme-sm hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200 transition-colors duration-200 
                ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}
              `}
            >
              <svg
                className="w-5 h-5 fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300 transition-colors duration-200 shrink-0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.38760 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                />
              </svg>
              {/* Menyembunyikan teks Sign out saat tidak expanded/hovered */}
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="truncate">Sign out</span>
              )}
            </button>
            
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;