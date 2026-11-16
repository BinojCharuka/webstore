/**
 * Utility to resolve official logos/crests for schools, colleges and universities
 */
export function getEducationLogo(item: { institution?: string; logo?: string }): string {
  if (item.logo && item.logo.trim()) {
    return item.logo;
  }
  const name = (item.institution || "").toLowerCase();
  if (name.includes("wayamba") || name.includes("wusl")) {
    return "/assets/education/wusl.svg";
  }
  if (name.includes("ananda")) {
    return "/assets/education/ananda.svg";
  }
  if (name.includes("rajasinghe")) {
    return "/assets/education/rajasinghe.svg";
  }
  return "/assets/education/default.svg";
}

