import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = {
    children: ReactNode;
    /** Fill the viewport, for the app-level boundary that has no layout around it. */
    fullScreen?: boolean;
};

type State = {
    error: Error | null;
};

/**
 * Catches render errors in its children and shows a recoverable fallback
 * instead of unmounting the whole app.
 */
export default class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error(error, info.componentStack);
    }

    reset = (): void => {
        this.setState({ error: null });
    };

    render(): ReactNode {
        const { error } = this.state;

        if (!error) {
            return this.props.children;
        }

        return (
            <div
                role="alert"
                className={cn(
                    'flex flex-1 items-center justify-center p-6',
                    this.props.fullScreen && 'min-h-dvh bg-background',
                )}
            >
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center gap-4 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-6" />
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold">
                                Something went wrong
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                This page hit an unexpected error. Try again, or
                                reload the page if it keeps happening.
                            </p>
                        </div>

                        {import.meta.env.DEV && (
                            <pre className="max-h-40 w-full overflow-auto rounded-md bg-muted p-3 text-left text-xs whitespace-pre-wrap text-destructive">
                                {error.message}
                            </pre>
                        )}

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={this.reset}>
                                <RotateCcw />
                                Try again
                            </Button>
                            <Button onClick={() => window.location.reload()}>
                                <RefreshCw />
                                Reload page
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}
