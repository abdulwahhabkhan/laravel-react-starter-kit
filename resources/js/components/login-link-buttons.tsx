import { Form } from '@inertiajs/react';
import { ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { dashboard, loginLinkLogin } from '@/routes';

export type LoginLink = {
    role: string;
    label: string;
    email: string;
    attributes: string;
};

export default function LoginLinkButtons({ links }: { links: LoginLink[] }) {
    if (links.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="relative flex items-center">
                <div className="flex-grow border-t" />
                <span className="mx-3 text-xs text-muted-foreground uppercase">
                    Quick login
                </span>
                <div className="flex-grow border-t" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {links.map((link) => (
                    <Form key={link.role} {...loginLinkLogin.form()}>
                        {({ processing }) => (
                            <>
                                <input
                                    type="hidden"
                                    name="email"
                                    value={link.email}
                                />
                                <input
                                    type="hidden"
                                    name="user_attributes"
                                    value={link.attributes}
                                />
                                <input
                                    type="hidden"
                                    name="redirect_url"
                                    value={dashboard.url()}
                                />
                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="w-full"
                                    disabled={processing}
                                    data-test={`login-as-${link.role}`}
                                >
                                    {processing ? (
                                        <Spinner />
                                    ) : link.role === 'admin' ? (
                                        <ShieldCheck />
                                    ) : (
                                        <User />
                                    )}
                                    {link.label}
                                </Button>
                            </>
                        )}
                    </Form>
                ))}
            </div>
        </div>
    );
}
