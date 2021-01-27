!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e)
}(this, function(e) {
    var t = function(e, t, i, o, n) {
        this.scene = e,
        this.renderer = t,
        this.container = i,
        r.initDomStyle(i),
        r.setCameraPara(this, o, n),
        this.vrbox = {
            radius: 2,
            widthSegments: 180,
            heightSegments: 180,
            width: 2,
            height: 2,
            depth: 2
        },
        this.liveSettings = {
            forceUseHls: !1,
            forceUseVndAppleMpegUrl: !1,
            forceUseXmpegUrl: !1,
            usePlugin: !1,
            loadPlugin: function(e) {
                console.log("load video", e)
            }
        },
        this.hlsConfig = {
            autoStartLoad: !0
        },
        this.flvConfig = {
            type: "flv",
            isLive: !0
        },
        this.destoryed = !1,
        this.video = null,
        this.audio = null,
        this.toolBar = null,
        this.clock = new THREE.Clock,
        this.VRObject = new THREE.Object3D,
        this.defaultAutoHideLeftTime = 3,
        this.defaultVoiceHideLeftTime = 2,
        this.defaultVolume = .3,
        this.sliceSegment = 0,
        this._controlTarget = new THREE.Vector3(0,0,1e-4),
        this._cubeCameraTimes = .96,
        this.resType = {
            video: "video",
            box: "box",
            slice: "slice",
            sliceVideo: "sliceVideo",
            flvVideo: "flvVideo"
        },
        this.videoPlayHook = function() {
            console.log("video play")
        }
        ,
        this.videoPauseHook = function() {
            console.log("video pause")
        }
        ,
        this.asteroidConfig = {
            enable: !1,
            asteroidFPS: 10,
            asteroidFov: 135,
            asteroidForwardTime: 2600,
            asteroidWaitTime: 2e3,
            asteroidDepressionRate: .5,
            asteroidTop: 1,
            cubeResolution: 2048,
            rotationAngleOfZ: 0
        },
        this.VRhint = "请翻转屏幕锁定装入VR盒子中",
        this.camera = new THREE.PerspectiveCamera(this.cameraPara.fov,this.cameraPara.aspect,this.cameraPara.near,this.cameraPara.far),
        this.camera.lookAt(this._controlTarget),
        this.cameraEvt = {
            controlGroup: function() {},
            updatePosition: function() {},
            hover: function() {},
            leave: function() {}
        },
        this._takeScreenShot = !1,
        this.timerList = {},
        this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z),
        this.loadProgressManager = new THREE.LoadingManager(function(e) {
            console.log("loaded")
        }
        ,function(e, t, i) {
            console.log("item=", e, "loaded", t, "total=", i)
        }
        ,function(e, t) {
            console.log(e, t)
        }
        ),
        this.scene.add(this.camera),
        this.scene.add(this.VRObject),
        this.effect = r.stereoEffect(this.renderer),
        r.bindOrientationEvent(this, this._controlTarget)
    };
    t.prototype.destroy = function() {
        var e = this;
        e.video && (e.video.pause(),
        e.video = null),
        e.audio && (e.audio.pause(),
        e.audio = null),
        e.hlsPlayer && e.hlsPlayer.destroy(),
        e.flvPlayer && e.flvPlayer.destroy();
        for (var t in e.timerList)
            clearInterval(e.timerList[t]);
        e.destoryed = !0
    }
    ,
    t.prototype.init = function(e) {
        function t() {
            f.controls && f.controls.reset()
        }
        function i(e) {
            y.isMouseDown = !0;
            var t = e.clientX || e.changedTouches[0].clientX
              , i = e.clientY || e.changedTouches[0].clientY;
            p.set(t, i),
            g.set(t, i),
            f.autoHideLeftTime = f.defaultAutoHideLeftTime,
            y.isActive = !0
        }
        function o(e) {
            y.isMouseDown = !1
        }
        function n(e) {
            if (e.preventDefault(),
            f.autoHideLeftTime = f.defaultAutoHideLeftTime,
            f.toolBar.isActive = !0,
            y.isMouseDown) {
                var t = e.clientX || e.changedTouches[0].clientX
                  , i = e.clientY || e.changedTouches[0].clientY
                  , r = g.y - i;
                r >= 5 && s(6),
                r <= -5 && s(-10),
                g.set(t, i)
            }
        }
        function a(e) {
            if (void 0 === f.controls.defaultDampingFactor && (f.controls.defaultDampingFactor = f.controls.dampingFactor),
            void 0 === f.controls.object.defaultFov && (f.controls.object.defaultFov = f.controls.object.fov),
            e) {
                var t = 0
                  , i = [];
                [].forEach.call(e, function(e) {
                    var r = b[e.identifier];
                    if (r && (r.y = e.pageY,
                    r.x = e.pageX,
                    i.push(e.identifier)),
                    t++,
                    t >= 2) {
                        var o = b[i[0]]
                          , n = b[i[1]]
                          , a = Math.sqrt(Math.pow(o.x - n.x, 2) + Math.pow(o.y - n.y, 2))
                          , s = (a - w) / 4;
                        return f.controls.object.fov - s < 140 && f.controls.object.fov - s > 10 && w && (f.controls.enable = !1,
                        f.controls.object.fov -= s,
                        f.controls.dampingFactor = f.controls.defaultDampingFactor * f.controls.object.defaultFov / f.controls.object.fov),
                        w = a,
                        void (t = 0)
                    }
                })
            }
        }
        function s(e) {
            clearInterval(f.timerList.slideBarAniateTimer),
            f.timerList.slideBarAniateTimer = animateTimer = setInterval(function() {
                var t = y.toolbar.clientHeight + e;
                t >= y.defaultHeight && t <= y.defaultMaxHeight ? (y.toolbar.style.height = t + "px",
                y.isActive = !0) : (clearInterval(animateTimer),
                e > 0 ? (y.isActive = !0,
                y.moreBtn.style.transform = "rotate(-180deg)",
                y.moreBtn.style.webkitTransform = "rotate(-180deg)",
                y.toolbar.style.height = y.defaultMaxHeight + "px",
                y.about.style.display = "block") : (y.isActive = !1,
                y.moreBtn.style.transform = "rotate(0deg)",
                y.moreBtn.style.webkitTransform = "rotate(0deg)",
                y.toolbar.style.height = y.defaultHeight + "px",
                y.about.style.display = "none")),
                f.autoHideLeftTime = f.defaultAutoHideLeftTime
            }, 1)
        }
        function c(e) {
            f.autoHideLeftTime = f.defaultAutoHideLeftTime,
            y.isActive = !0;
            var t = e.clientX || e.changedTouches[0].clientX
              , i = e.clientY || e.changedTouches[0].clientY;
            y.isMouseDown && (y.moreList.scrollLeft += 2.5 * (g.x - t)),
            g.set(t, i)
        }
        function l(e) {
            f.camera.fov += .05 * e,
            f.camera.updateProjectionMatrix()
        }
        function d(e) {
            if (e.style.borderColor = "green",
            e.style.color = "green",
            f.cameraEvt.controlGroup.length) {
                var t = f.cameraEvt.controlGroup.getObjectByName("__focus");
                t.visible = !0
            }
        }
        function u(e) {
            if (e.style.borderColor = "white",
            e.style.color = "white",
            f.cameraEvt.controlGroup.length) {
                var t = f.cameraEvt.controlGroup.getObjectByName("__focus");
                t.visible = !1
            }
        }
        function m() {
            var e = f.video || f.audio;
            if (e) {
                var t = r.getBoundingClientRect(f.container);
                y.voice_bar.style.display = "block";
                var i, o = y.voice_bar, n = o.firstChild, a = n.firstChild, s = (a.firstChild,
                !1), c = 0, l = 0;
                e.volume = f.defaultVolume;
                var d = y.voice_bar.clientHeight
                  , u = (f.container.clientHeight - d) / 2
                  , m = d + u;
                a.style.height = e.volume * d + "px",
                o.addEventListener("mousedown", function(e) {
                    o.style.opacity = 1
                }, !1),
                n.addEventListener("click", function(i) {
                    var r = (i.clientY || i.changedTouches[0].clientY) - t.top;
                    f.voiceHideLeftTime = f.defaultVoiceHideLeftTime;
                    var o = m - r;
                    o / d <= 1 && (a.style.height = o + "px",
                    e.volume = o / d)
                }, !1),
                o.addEventListener("mouseout", function(e) {
                    s = !1
                }, !1),
                o.addEventListener("mousedown", function(e) {
                    s = !0
                }, !1),
                o.addEventListener("mouseup", function(e) {
                    s = !1
                }, !1),
                o.addEventListener("mousemove", function(i) {
                    var r = (i.clientY || i.changedTouches[0].clientY) - t.top;
                    if (f.voiceHideLeftTime = f.defaultVoiceHideLeftTime,
                    s) {
                        var o = m - r;
                        a.style.height = o + "px",
                        o / d <= 1 && (e.volume = o / d)
                    }
                }, !1),
                o.addEventListener("touchstart", function(e) {
                    e.preventDefault(),
                    f.voiceHideLeftTime = f.defaultVoiceHideLeftTime,
                    i = a.clientHeight,
                    c = e.touches[0].pageY,
                    o.style.opacity = 1
                }, !1),
                o.addEventListener("touchmove", function(t) {
                    t.preventDefault(),
                    f.voiceHideLeftTime = f.defaultVoiceHideLeftTime,
                    l = t.touches[0].pageY;
                    var r = i + (c - l);
                    r / d <= 1 && (a.style.height = r + "px",
                    e.volume = r / d)
                }, !1),
                o.addEventListener("touchend", function(e) {
                    i = 0
                }, !1),
                clearInterval(f.timerList.voiceBarActiveTimer),
                f.timerList.voiceBarActiveTimer = setInterval(function() {
                    f.voiceHideLeftTime <= 0 ? o.style.opacity = 0 : f.toolBar.isActive ? null : f.voiceHideLeftTime--
                }, 1e3)
            }
        }
        function h() {
            if (!f.destoryed) {
                var t = f.container.offsetWidth
                  , i = f.container.offsetHeight;
                if (f.camera.aspect = t / i,
                r.isMobileDevice() && r.isCrossScreen() ? (f.cameraEvt.updatePosition(),
                f.effect.setSize(t, i),
                f.effect.render(f.scene, f.camera)) : (f.renderer.setSize(t, i),
                f.renderer.setClearColor(new THREE.Color(16777215)),
                f.renderer.render(f.scene, f.camera)),
                f._takeScreenShot) {
                    f._takeScreenShot = !1;
                    var o = f.renderer.domElement.toDataURL("image/jpeg");
                    f._takeScreenShotCallback(o)
                }
                f.camera.updateProjectionMatrix(),
                f.controls && f.controls.update(),
                e()
            }
        }
        function v() {
            h(),
            requestAnimationFrame(v)
        }
        var f = this
          , p = new THREE.Vector2
          , g = new THREE.Vector2;
        f.toolBar = r.toolBar(f.container);
        var E, T, y = f.toolBar, b = {}, w = 0;
        y.defaultHeight = y.toolbar.clientHeight,
        y.defaultMaxHeight = 5 * y.defaultHeight,
        y.isMouseDown = !1,
        f.container.addEventListener("click", function() {
            f.autoHideLeftTime = f.defaultAutoHideLeftTime,
            y.toolbar.style.display = "block"
        }),
        y.gyroBtn.addEventListener("click", function() {
            f.gyroBtnClick()
        }, !1),
        y.vrBtn.addEventListener("click", function() {
            f.vrBtnClick()
        }, !1),
        y.moreBtn.addEventListener("click", function() {
            f.moreBtnClick()
        }, !1),
        f.container.addEventListener("touchstart", function(e) {
            f.touchStart(e)
        }, !1),
        f.container.addEventListener("touchmove", function(e) {
            f.touchMove(e)
        }, !1),
        f.container.addEventListener("touchend", function(e) {
            f.touchEnd(e)
        }, !1),
        y.gyroResetBtn.addEventListener("click", t, !1),
        y.toolbar.addEventListener("mousedown", i, !1),
        y.toolbar.addEventListener("touchstart", i, !1),
        y.toolbar.addEventListener("mousemove", n, !1),
        y.toolbar.addEventListener("touchmove", n, !1),
        y.toolbar.addEventListener("mouseup", o, !1),
        y.toolbar.addEventListener("touchend", o, !1),
        y.toolbar.addEventListener("mouseout", function(e) {
            f.autoHideLeftTime = f.defaultAutoHideLeftTime,
            y.isActive = !1
        }, !1),
        f.renderer.domElement.addEventListener("wheel", function(e) {
            var t = e.deltaY > 0 ? 15 : -15;
            f.camera.fov + .05 * t >= 10 && f.camera.fov + .05 * t <= 120 && l(t)
        }, !1),
        y.moreList.addEventListener("mousemove", c, !1),
        y.moreList.addEventListener("touchmove", c, !1),
        f.moreBtnClick = function(e) {
            s(y.toolbar.clientHeight > y.defaultHeight ? -10 : 6)
        }
        ,
        f.vrBtnClick = function(e) {
            var t = f.toolBar.vrBtn;
            r.isMobileDevice() ? r.OS.isWeixin() && !r.OS.isiOS() ? "landscape" == f.video.getAttribute("x5-video-orientation") ? (f.video.setAttribute("x5-video-orientation", "portraint"),
            u(t)) : (f.video.setAttribute("x5-video-orientation", "landscape"),
            d(t)) : r.isCrossScreen() ? (d(t),
            r.fullscreen(f.container)) : (u(t),
            r.msgBox(f.VRhint, 5, f.container)) : (t.getAttribute("fullscreen") ? (u(t),
            t.removeAttribute("fullscreen")) : (d(t),
            t.setAttribute("fullscreen", "true")),
            r.fullscreen(f.container))
        }
        ,
        f.gyroBtnClick = function(e) {
            var t = f.toolBar.gyroBtn;
            "active" == t.getAttribute("active") ? (f.controls.gyroFreeze(),
            u(t),
            u(y.circle1),
            u(y.circle2),
            t.removeAttribute("active")) : (f.controls.gyroUnfreeze(),
            t.setAttribute("active", "active"),
            d(t),
            d(y.circle1),
            d(y.circle2))
        }
        ,
        f.touchStart = function(e) {
            e.targetTouches && ([].forEach.call(e.targetTouches, function(e) {
                b[e.identifier] || (b[e.identifier] = new THREE.Vector2(0,0))
            }),
            clearInterval(f.timerList.renderTouchersRimer),
            f.timerList.renderTouchersRimer = setInterval(function() {
                a(E)
            }, 1))
        }
        ,
        f.touchEnd = function(e) {
            e.targetTouches && ([].forEach.call(e.changedTouches, function(e) {
                var t = b[e.identifier];
                t && delete b[e.identifier]
            }),
            0 === e.targetTouches.length && (w = 0,
            f.controls.enable = !0,
            clearInterval(T)))
        }
        ,
        f.touchMove = function(e) {
            E = e.touches
        }
        ,
        f.windowResize = function() {
            r.isFullscreen() ? r.isMobileDevice() ? r.isCrossScreen() ? d(f.toolBar.vrBtn) : u(f.toolBar.vrBtn) : d(f.toolBar.vrBtn) : r.OS.isWeixin() && !r.OS.isiOS() ? ("landscape" == f.video.getAttribute("x5-video-orientation") ? d(f.toolBar.vrBtn) : u(f.toolBar.vrBtn),
            r.isCrossScreen() ? d(f.toolBar.vrBtn) : u(f.toolBar.vrBtn)) : (r.isCrossScreen() ? d(f.toolBar.vrBtn) : u(f.toolBar.vrBtn),
            u(f.toolBar.vrBtn))
        }
        ,
        window.addEventListener("resize", function() {
            m()
        }, !1),
        f._play = function() {
            y.btn.style.border = "none",
            y.btn.style.fontWeight = 800,
            y.btn.innerHTML = "<b>||</b>"
        }
        ,
        f._pause = function() {
            y.btn.innerText = "",
            y.btn.style.borderTop = "0.6rem solid transparent",
            y.btn.style.borderLeft = "1rem solid white",
            y.btn.style.borderBottom = "0.6rem solid transparent"
        }
        ,
        f.bindVolumeBar = m,
        v(),
        clearInterval(f.timerList.toolBarAutoHideTimer),
        f.timerList.toolBarAutoHideTimer = setInterval(function() {
            y.isActive || (f.autoHideLeftTime < 0 ? (y.toolbar.style.display = "none",
            f.autoHideLeftTime = f.defaultAutoHideLeftTime,
            y.isActive = !1) : f.autoHideLeftTime--),
            f.windowResize()
        }, 1e3)
    }
    ,
    t.prototype.takeScreenShot = function(e) {
        this._takeScreenShot = !0,
        this._takeScreenShotCallback = e
    }
    ,
    t.prototype.playPanorama = function(e, t) {
        function i() {
            v.hlsPlayer = new Hls(v.hlsConfig),
            v.hlsPlayer.loadSource(e),
            v.hlsPlayer.attachMedia(L),
            v.hlsPlayer.on(Hls.Events.MANIFEST_PARSED, function() {
                L.play()
            })
        }
        function o() {
            var t = r.createTag("source", {
                src: e,
                type: "application/x-mpegURL"
            }, null);
            L.appendChild(t)
        }
        function n() {
            L.src = e,
            L.addEventListener("loadedmetadata", function() {
                L.play()
            })
        }
        function a(e) {
            L.paused ? (v._play(),
            L.play(),
            v.videoPlayHook()) : (v._pause(),
            L.pause(),
            v.videoPauseHook())
        }
        function s(e) {
            rect = r.getBoundingClientRect(v.container);
            var t = (e.clientX || e.changedTouches[0].clientX) - rect.left;
            L.currentTime = L.duration * (t / this.clientWidth)
        }
        function c(e) {
            v.video.buffTimer || (clearInterval(v.timerList.videoBuffTimer),
            v.timerList.videoBuffTimer = v.video.buffTimer = setInterval(function(e) {
                var t = 0;
                0 != L.buffered.length && (t += L.buffered.end(0)),
                t >= L.duration && clearInterval(v.video.buffTimer),
                f.loadedProgress.style.width = t / L.duration * 100 + "%"
            }, 500))
        }
        function l(e, t) {
            t = t || !1,
            material = new THREE.MeshBasicMaterial({
                overdraw: !0,
                map: e
            });
            var i = v.VRObject.getObjectByName("__mxrealityDefault");
            if (i)
                i.material = material,
                i.visible = !0;
            else {
                var r = -Math.PI / 2
                  , o = new THREE.SphereBufferGeometry(v.vrbox.radius,v.vrbox.widthSegments,v.vrbox.heightSegments,r);
                o.scale(-1, 1, 1),
                mesh = new THREE.Mesh(o,material),
                mesh.visible = !0,
                mesh.name = "__mxrealityDefault",
                t && (mesh.matrixAutoUpdate = !1,
                mesh.updateMatrix(),
                v.toolBar.timeInfo.style.display = "none"),
                v.VRObject.add(mesh)
            }
            v.asteroidConfig.enable && (v.asteroidForward = function(e) {
                d(e)
            }
            )
        }
        function d(e) {
            v.controls && (v.controls.reset(),
            v.controls.enable = !1);
            var t = v.asteroidConfig
              , i = v.camera.fov
              , r = v._containerRadius * (.9 * v._cubeCameraTimes);
            v.camera.position.y = r * t.asteroidTop,
            v.camera.rotation.x = THREE.Math.degToRad(-90),
            v.camera.fov = t.asteroidFov;
            var o = t.asteroidForwardTime * t.asteroidFPS / 300
              , n = r / o
              , a = v.camera.fov - i
              , s = a / o
              , c = (Math.PI / 2 / o,
            !1)
              , l = !1
              , d = new THREE.Vector3(v._controlTarget.x,v._controlTarget.y,v._controlTarget.z);
            setTimeout(function() {
                v.timerList.asteroidForwardTimer = asteroidForwardTimer = setInterval(function() {
                    t.asteroidTop * v.camera.position.y - n >= 0 ? (v.camera.position.y -= n * t.asteroidTop,
                    v.camera.lookAt(d),
                    d.z *= 1.25) : c = !0,
                    v.camera.fov - s >= i ? v.camera.fov -= s : l = !0,
                    c && l && (clearInterval(asteroidForwardTimer),
                    v.controls.enable = !0,
                    v.camera.position.y = 0,
                    v.camera.fov = i,
                    void 0 !== e && e())
                }, t.asteroidFPS)
            }, t.asteroidWaitTime)
        }
        var u = ["__mxrealitySkybox", "__mxrealitySlice", "__mxrealityDefault"];
        for (var m in u) {
            var h = this.VRObject.getObjectByName(u[m]);
            h && (h.visible = !1),
            this.cubeCameraSphere && (this.cubeCameraSphere.visible = !1)
        }
        var v = this
          , f = v.toolBar;
        if (v._containerRadius = v.resType.box == t || v.resType.slice == t ? v.vrbox.width / 2 : v.vrbox.radius,
        v.autoHideLeftTime = v.defaultAutoHideLeftTime,
        v.voiceHideLeftTime = v.defaultVoiceHideLeftTime,
        v.resType.box == t) {
            v.toolBar.timeInfo.style.display = "none";
            var p = []
              , g = []
              , E = new Image;
            E.crossOrigin = "Anonymous",
            E.src = e,
            E.onload = function() {
                for (var e, t, i = E.height, r = 0; r < 6; r++)
                    p[r] = new THREE.Texture,
                    e = document.createElement("canvas"),
                    t = e.getContext("2d"),
                    e.height = i,
                    e.width = i,
                    t.drawImage(E, i * r, 0, i, i, 0, 0, i, i),
                    p[r].image = e,
                    p[r].needsUpdate = !0,
                    g.push(new THREE.MeshBasicMaterial({
                        map: p[r]
                    }));
                var o = v.VRObject.getObjectByName("__mxrealitySkybox");
                if (o)
                    o.material = g;
                else {
                    var o = new THREE.Mesh(new THREE.CubeGeometry(v.vrbox.width,v.vrbox.height,v.vrbox.depth),new THREE.MultiMaterial(g));
                    o.applyMatrix((new THREE.Matrix4).makeScale(1, 1, -1)),
                    o.visible = !0,
                    o.name = "__mxrealitySkybox",
                    o.matrixAutoUpdate = !1,
                    o.updateMatrix(),
                    v.VRObject.add(o),
                    f.btn.addEventListener("click", function(e) {
                        v.controls.autoRotate ? v._pause() : v._play(),
                        v.controls.autoRotate = !v.controls.autoRotate
                    })
                }
                v.loadProgressManager.onLoad()
            }
        } else if (v.resType.slice == t) {
            v.toolBar.timeInfo.style.display = "none";
            var T = new THREE.TextureLoader(v.loadProgressManager);
            T.mapping = THREE.UVMapping;
            for (var g = [], m = 0; m < e.length; m++) {
                var y = T.load(e[m]);
                g.push(new THREE.MeshBasicMaterial({
                    map: y
                }))
            }
            for (var b = new THREE.CubeGeometry(v.vrbox.width,v.vrbox.height,v.vrbox.depth,v.sliceSegment,v.sliceSegment,v.sliceSegment), w = 0, x = [new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(1,1), new THREE.Vector2(0,1)], m = 0, R = b.faces.length; m < R; m += 2)
                b.faces[m].materialIndex = w,
                b.faces[m + 1].materialIndex = w,
                b.faceVertexUvs[0][m] = [x[3], x[0], x[2]],
                b.faceVertexUvs[0][m + 1] = [x[0], x[1], x[2]],
                w++;
            var h = v.VRObject.getObjectByName("__mxrealitySlice");
            if (h)
                h.material = g,
                h.geometry = b,
                h.updateMatrix();
            else {
                var H = new THREE.Mesh(b,g);
                H.applyMatrix((new THREE.Matrix4).makeScale(1, 1, -1)),
                H.name = "__mxrealitySlice",
                H.visible = !0,
                H.matrixAutoUpdate = !1,
                H.updateMatrix(),
                v.VRObject.add(H),
                v.cubeCamera = new THREE.CubeCamera(v._containerRadius,v.cameraPara.far,v.asteroidConfig.cubeResolution);
                var C = v.cubeCamera.renderTarget.texture;
                C.minFilter = THREE.LinearMipMapLinearFilter,
                v.VRObject.add(v.cubeCamera),
                material = new THREE.MeshBasicMaterial({
                    envMap: v.cubeCamera.renderTarget.texture,
                    side: THREE.BackSide
                }),
                v.cubeCameraSphere = new THREE.Mesh(new THREE.SphereGeometry(v._containerRadius * v._cubeCameraTimes,180,180),material),
                v.cubeCameraSphere.position.set(0, 0, 0),
                v.cubeCameraSphere.name = "__mxrealitySlice",
                v.cubeCameraSphere.visible = !0,
                v.cubeCameraSphere.matrixAutoUpdate = !1,
                v.cubeCameraSphere.updateMatrix(),
                v.VRObject.add(v.cubeCameraSphere),
                f.btn.addEventListener("click", function(e) {
                    v.controls.autoRotate ? v._pause() : v._play(),
                    v.controls.autoRotate = !v.controls.autoRotate
                })
            }
            v.asteroidConfig.enable ? (v.cubeCameraSphere.visible = !0,
            v.asteroidForward = function(e) {
                v.cubeCamera.update(v.renderer, v.scene),
                d(e)
            }
            ) : v.cubeCameraSphere.visible = !1
        } else {
            var S = [v.resType.video, v.resType.sliceVideo, v.resType.flvVideo];
            if (S.indexOf(t) >= 0) {
                if (v.video)
                    for (var L = v.video, P = 0; P < L.childNodes.length; P++)
                        L.removeChild(L.childNodes[P]);
                else
                    var L = v.video = r.createTag("video", {
                        "webkit-playsinline": !0,
                        playsinline: !0,
                        preload: "auto",
                        "x-webkit-airplay": "allow",
                        "x5-video-player-type": "h5",
                        "x5-video-player-fullscreen": !0,
                        "x5-video-orientation": "portrait",
                        style: "object-fit: fill",
                        loop: "loop"
                    }, {
                        allowsInlineMediaPlayback: !0,
                        crossOrigin: "Anonymous"
                    });
                if (v.resType.sliceVideo == t)
                    v.liveSettings.usePlugin ? v.liveSettings.loadPlugin(L) : v.liveSettings.forceUseHls ? (i(),
                    console.info("force use hls")) : v.liveSettings.forceUseVndAppleMpegUrl ? (n(),
                    console.info("force use application/vnd.apple.mpegurl")) : v.liveSettings.forceUseXmpegUrl ? (o(),
                    console.info("force use application/x-mpegURL")) : Hls.isSupported() ? i() : L.canPlayType("application/vnd.apple.mpegurl") ? n() : L.canPlayType("application/x-mpegURL") ? o() : console.error("The browser does not support the current live stream," + e);
                else if (v.resType.flvVideo == t) {
                    if (!flvjs.isSupported())
                        return void console.error("Your browser does not support flvjs");
                    v.flvConfig.url = e,
                    v.flvPlayer = flvjs.createPlayer(v.flvConfig),
                    v.flvPlayer.attachMediaElement(L),
                    v.flvPlayer.load(),
                    v.flvPlayer.play()
                } else
                    L.canPlayType("application/vnd.apple.mpegurl") ? L.src = e : L.src = e;
                L.removeEventListener("canplaythrough", c),
                f.progressBar.removeEventListener("click", s),
                f.btn.removeEventListener("click", a),
                L.addEventListener("canplaythrough", c, !1),
                f.progressBar.addEventListener("click", s, !1),
                f.btn.addEventListener("click", a, !1),
                L.load(),
                v.video.buffTimer = null;
                var y = new THREE.VideoTexture(L);
                y.generateMipmaps = !1,
                y.minFilter = THREE.LinearFilter,
                y.magFilter = THREE.LinearFilter,
                y.format = THREE.RGBAFormat,
                l(y),
                clearInterval(v.timerList.videoProgressTimer),
                v.timerList.videoProgressTimer = v.video.progressTimer = setInterval(function(e) {
                    f.playProgress.style.width = L.currentTime / L.duration * 100 + "%",
                    f.curTime.innerText = r.formatSeconds(L.currentTime),
                    f.totalTime.innerText = r.formatSeconds(L.duration),
                    v.autoHideLeftTime < 0 && !L.paused ? f.toolbar.style.display = "none" : v.autoHideLeftTime--
                }, 1e3),
                v.loadProgressManager.onLoad()
            } else
                new THREE.TextureLoader(v.loadProgressManager).load(e, function(e) {
                    l(e, !0)
                })
        }
    }
    ,
    t.prototype.sphere2BoxPano = function(e, t, i, r) {
        function o(e, t, i, r) {
            var o = e.createTexture();
            if (!o)
                return console.log("Failed to create the texture object!"),
                !1;
            var a = e.getUniformLocation(t, "u_Sampler");
            return n(e, i, o, a, r),
            !0
        }
        function n(e, t, i, o, n) {
            m.asteroidConfig.enable && e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, -1),
            e.activeTexture(e.TEXTURE0),
            e.bindTexture(e.TEXTURE_2D, i),
            e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR),
            e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE),
            e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE),
            e.texImage2D(e.TEXTURE_2D, 0, e.RGB, e.RGB, e.UNSIGNED_BYTE, n),
            e.uniform1i(o, 0),
            e.clear(e.COLOR_BUFFER_BIT),
            e.drawArrays(e.TRIANGLE_STRIP, 0, t),
            f < 5 ? f++ : r(u())
        }
        function a(e, t) {
            var i = new Float32Array([-1, 1, 0, 1, -1, -1, 0, 0, 1, 1, 1, 1, 1, -1, 1, 0])
              , r = 4
              , o = e.createBuffer();
            if (!o)
                return console.log("Failed to create the buffer object!"),
                -1;
            e.bindBuffer(e.ARRAY_BUFFER, o),
            e.bufferData(e.ARRAY_BUFFER, i, e.STATIC_DRAW);
            var n = i.BYTES_PER_ELEMENT
              , a = e.getAttribLocation(t, "a_Position");
            e.vertexAttribPointer(a, 2, e.FLOAT, !1, 4 * n, 0),
            e.enableVertexAttribArray(a);
            var s = e.getAttribLocation(t, "a_TexCoord");
            return e.vertexAttribPointer(s, 2, e.FLOAT, !1, 4 * n, 2 * n),
            e.enableVertexAttribArray(s),
            r
        }
        function s(e, t) {
            var i, r = c(e, t), o = c(e);
            return i = e.createProgram(),
            e.attachShader(i, o),
            e.attachShader(i, r),
            e.linkProgram(i),
            e.getProgramParameter(i, e.LINK_STATUS) ? (e.useProgram(i),
            e.enableVertexAttribArray(i.vertexPositionAttribute),
            i.vertexColorAttribute = e.getAttribLocation(i, "aVertexColor"),
            i.pMatrixUniform = e.getUniformLocation(i, "uPMatrix"),
            i.mvMatrixUniform = e.getUniformLocation(i, "uMVMatrix"),
            i) : null
        }
        function c(e, t) {
            var i, r;
            if (t) {
                if (i = l(t),
                !i)
                    return null;
                r = e.createShader(e.FRAGMENT_SHADER)
            } else
                i = d(),
                r = e.createShader(e.VERTEX_SHADER);
            return e.shaderSource(r, i),
            e.compileShader(r),
            e.getShaderParameter(r, e.COMPILE_STATUS) ? r : (console.log(e.getShaderInfoLog(r)),
            null)
        }
        function l(e) {
            var t = ""
              , i = "\n        precision mediump float;\n        varying vec2 v_TexCoord;\n        uniform sampler2D u_Sampler;\n        uniform float PI;\n"
              , r = "\n        if(abs(theta)>PI){\n            if(theta>PI){\n                theta -= 2.0*PI;\n            }else{\n                theta += 2.0*PI;\n            }\n        }\n        if(abs(phi)>PI/2.0){\n            if(phi>PI/2.0){\n                phi -= PI;\n            }else{                phi += PI;\n            }\n        }\n        float x = theta/PI*0.5 + 0.5;\n        float y = phi/PI*2.0*0.5 + 0.5;\n        gl_FragColor = texture2D(u_Sampler, vec2(x,y));\n";
            return "z" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(0.5-v_TexCoord.x,v_TexCoord.y-0.5);\n\t\t\t\tfloat theta = atan(orig.x,r);\n\t\t\t\tfloat phi = atan(orig.y*cos(theta),r);" + r + "\n\t\t\t}\n" : "nz" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(0.5-v_TexCoord.x,v_TexCoord.y-0.5);\n\t\t\t\tfloat theta = atan(orig.x,r);\n\t\t\t\tfloat phi = atan(orig.y*cos(theta),r);\n        \t\ttheta = theta+PI;\n" + r + "\n\t\t\t}\n" : "x" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(v_TexCoord.x-0.5,v_TexCoord.y-0.5);\n\t\t\t\tfloat theta = atan(r,orig.x);\n\t\t\t\tfloat phi = atan(orig.y*sin(theta),r);" + r + "\n\t\t\t}\n" : "nx" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(v_TexCoord.x-0.5,v_TexCoord.y-0.5);\n\t\t\t\tfloat theta = atan(r,orig.x);\n\t\t\t\tfloat phi = atan(orig.y*sin(theta),r);\n        \t\ttheta = theta+PI;" + r + "\n\t\t\t}\n" : "y" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(0.5-v_TexCoord.x,0.5-v_TexCoord.y);\n        \t\tfloat theta = atan(orig.x,orig.y);\n        \t\tfloat phi = atan(r*sin(theta),orig.x);" + r + "\n\t\t\t}\n" : "ny" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(0.5-v_TexCoord.x,v_TexCoord.y-0.5);\n\t\t\t\tfloat theta = atan(orig.x,orig.y);\n\t\t\t\tfloat phi = atan(r*sin(theta),orig.x);\n\t\t\t\tphi = -phi;" + r + "\n\t\t\t}\n" : console.error("shader fragment type error!"),
            t
        }
        function d() {
            var e = "\n        attribute vec4 a_Position;\n        attribute vec2 a_TexCoord;\n        varying vec2 v_TexCoord;\n        void main() {\n            gl_Position= a_Position;\n            v_TexCoord = a_TexCoord;\n        }\n";
            return e
        }
        function u() {
            var e = document.createElement("canvas")
              , r = e.getContext("2d");
            e.width = 6 * t,
            e.height = i;
            var o = document.createElement("canvas")
              , n = o.getContext("2d");
            o.width = t,
            o.height = i;
            var a = 180 * Math.PI / 180;
            if (n.rotate(a),
            m.sliceSegment) {
                var s = []
                  , c = document.createElement("canvas");
                c.width = i / m.sliceSegment,
                c.height = i / m.sliceSegment;
                var l = c.getContext("2d");
                for (var d in v) {
                    n.drawImage(v[d], 0, 0, -t, -i);
                    for (var u = 0; u < m.sliceSegment; u++)
                        for (var h = 0; h < m.sliceSegment; h++)
                            l.putImageData(n.getImageData(h * (i / m.sliceSegment), u * (i / m.sliceSegment), i * (h + 1) / m.sliceSegment, i * (u + 1) / m.sliceSegment), 0, 0),
                            s.push(c.toDataURL("image/jpeg"))
                }
                return s
            }
            for (var d in v)
                n.drawImage(v[d], 0, 0, -t, -i),
                r.drawImage(o, t * d, 0, t, i);
            return e.toDataURL("image/jpeg")
        }
        var m = this
          , h = {
            x: "x",
            nx: "nx",
            ny: "ny",
            y: "y",
            z: "z",
            nz: "nz"
        }
          , v = []
          , f = 0
          , p = 0
          , g = new Image;
        g.crossOrigin = "Anonymous",
        g.src = e,
        g.onload = function() {
            for (var e in h) {
                var r = document.createElement("canvas");
                r.width = t,
                r.height = i,
                r.id = "face_" + e,
                v[p] = r;
                var n = r.getContext("webgl", {
                    preserveDrawingBuffer: !0
                })
                  , c = s(n, e)
                  , l = a(n, c)
                  , d = n.getUniformLocation(c, "PI");
                n.uniform1f(d, Math.PI),
                n.clearColor(0, 0, 0, 1),
                o(n, c, l, g) || console.log("Failed to intialize the texture."),
                p++
            }
        }
    }
    ;
    var i = function(e, t, i, o, n) {
        var a = this;
        this.scene = e,
        this.renderer = t,
        this.container = i,
        r.setCameraPara(a, o, n),
        this.constraints = {},
        this.video = null,
        this.openAudio = !1,
        this.cameraIndex = 1,
        this._controlTarget = new THREE.Vector3(1e-4,0,0),
        this.camera = new THREE.PerspectiveCamera(this.cameraPara.fov,this.cameraPara.aspect,this.cameraPara.near,this.cameraPara.far),
        this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z),
        this.cameraReady = !1,
        this.scene.add(this.camera),
        this.clock = new THREE.Clock,
        this.tempCanvas = document.createElement("canvas"),
        this.effect = r.stereoEffect(this.renderer),
        this._takeScreenShot = !1
    };
    i.prototype.init = function() {
        function e(e) {
            i.video.srcObject = e
        }
        function t(e) {
            alert(e)
        }
        var i = this;
        if (r.bindOrientationEvent(i, i._controlTarget),
        this.video = r.createTag("video", {
            "webkit-playsinline": !0,
            playsinline: !0,
            preload: "auto",
            "x-webkit-airplay": "allow",
            "x5-playsinline": !0,
            "x5-video-player-type": "h5",
            "x5-video-player-fullscreen": !0,
            "x5-video-orientation": "portrait",
            style: "object-fit: fill",
            autoplay: "autoplay"
        }, {
            allowsInlineMediaPlayback: !0
        }),
        this.video.style.zIndex = "-99999",
        this.video.style.position = "absolute",
        this.video.style.left = "0px",
        this.video.style.top = "0px",
        this.video.style.width = "2px",
        this.video.style.height = "2px",
        document.body.appendChild(this.video),
        this.video.oncanplaythrough = function() {
            i.cameraReady = !0,
            i.video.readyState === i.video.HAVE_ENOUGH_DATA && (i.cameraTexture = new THREE.VideoTexture(i.video),
            i.cameraTexture.generateMipmaps = !1,
            i.cameraTexture.format = THREE.RGBAFormat,
            i.cameraTexture.maxFilter = THREE.NearestFilter,
            i.cameraTexture.minFilter = THREE.NearestFilter,
            i.scene.background = i.cameraTexture,
            i.cameraTexture.needsUpdate = !0)
        }
        ,
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia,
        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL,
        navigator.getUserMedia) {
            var o = {
                audio: i.openAudio,
                video: {
                    facingMode: {
                        exact: i.cameraIndex ? "environment" : "user"
                    }
                }
            };
            navigator.getUserMedia(o, e, t)
        } else
            alert("Native device meadia streaming(getUserMdeia) not supported in this browser.")
    }
    ,
    i.prototype.takeCameraPhoto = function() {
        var e = this.tempCanvas.getContext("2d");
        return e.clearRect(0, 0, window.innerWidth, window.innerHeight),
        e.drawImage(this.video, 0, 0, window.innerWidth, window.innerHeight),
        e.toDataURL("image/jpeg")
    }
    ,
    i.prototype.takeScreenShot = function(e) {
        this._takeScreenShot = !0,
        this._takeScreenShotCallback = e
    }
    ,
    i.prototype.play = function() {
        function e() {
            if (i._takeScreenShot) {
                i._takeScreenShot = !1;
                var e = i.renderer.domElement.toDataURL("image/jpeg");
                i._takeScreenShotCallback(e)
            }
            if (i.cameraReady) {
                var t = window.innerWidth
                  , o = window.innerHeight;
                i.camera.aspect = t / o,
                i.cameraTexture.repeat.y = o / i.video.videoHeight,
                i.cameraTexture.offset.x = 0,
                i.cameraTexture.offset.y = 0,
                r.isMobileDevice() && r.isCrossScreen() ? (i.cameraTexture.repeat.x = t / (2 * i.video.videoWidth),
                i.effect.setSize(t, o),
                i.effect.render(i.scene, i.camera)) : (i.cameraTexture.repeat.x = t / i.video.videoWidth,
                i.renderer.setSize(t, o),
                i.renderer.setClearColor(new THREE.Color(16777215)),
                i.renderer.render(i.scene, i.camera)),
                i.camera.updateProjectionMatrix()
            }
            i.controls && i.controls.update(i.clock.getDelta())
        }
        function t() {
            requestAnimationFrame(t),
            e()
        }
        var i = this;
        t()
    }
    ;
    var r = {
        debug: !1,
        startGyro: function(e) {
            function t(t) {
                e(t)
            }
            window.addEventListener("deviceorientation", t, !1)
        },
        stereoEffect: function(e) {
            this.separation = 1,
            this.focalLength = 15;
            var t, i, r, o, n, a, s, c, l, d, u, m, h = new THREE.Vector3, v = new THREE.Quaternion, f = new THREE.Vector3, p = new THREE.PerspectiveCamera, g = new THREE.PerspectiveCamera;
            return e.autoClear = !1,
            this.setSize = function(r, o) {
                t = r / 2,
                i = o,
                e.setSize(r, o)
            }
            ,
            this.render = function(E, T) {
                E.updateMatrixWorld(),
                void 0 === T.parent && T.updateMatrixWorld(),
                T.matrixWorld.decompose(h, v, f),
                r = THREE.Math.radToDeg(2 * Math.atan(Math.tan(.5 * THREE.Math.degToRad(T.fov)))),
                c = T.near / this.focalLength,
                d = Math.tan(.5 * THREE.Math.degToRad(r)) * this.focalLength,
                l = .5 * d * T.aspect,
                a = d * c,
                s = -a,
                u = (l + this.separation / 2) / (2 * l),
                m = 1 - u,
                o = 2 * l * c * m,
                n = 2 * l * c * u,
                p.projectionMatrix.makePerspective(-o, n, a, s, T.near, T.far),
                p.position.copy(h),
                p.quaternion.copy(v),
                p.translateX(-this.separation / 2),
                g.projectionMatrix.makePerspective(-n, o, a, s, T.near, T.far),
                g.position.copy(h),
                g.quaternion.copy(v),
                g.translateX(this.separation / 2),
                e.setViewport(0, 0, 2 * t, i),
                e.setViewport(0, 0, t, i),
                e.render(E, p),
                e.setViewport(t, 0, t, i),
                e.render(E, g)
            }
            ,
            this
        },
        orbitControls: function(e, t) {
            var i = function(e, t) {
                function i() {
                    return 2 * Math.PI / 60 / 60 * g.autoRotateSpeed
                }
                function o(e) {
                    g.defaultDirectionOfRotation ? g.usingGyro ? b.theta -= e : b.theta += e : b.theta -= e
                }
                function n(e) {
                    g.defaultDirectionOfRotation ? g.usingGyro ? b.phi -= e : b.phi += e : b.phi -= e
                }
                function a(e, t, i, r) {
                    var o, n, a, s = e * t + i * r;
                    if (s > .499) {
                        a = 2 * Math.atan2(e, r),
                        o = Math.PI / 2,
                        n = 0;
                        var c = new THREE.Vector3(o,n,a);
                        return c
                    }
                    if (s < -.499) {
                        a = -2 * Math.atan2(e, r),
                        o = -Math.PI / 2,
                        n = 0;
                        var c = new THREE.Vector3(o,n,a);
                        return c
                    }
                    var l = e * e
                      , d = t * t
                      , u = i * i;
                    a = Math.atan2(2 * t * r - 2 * e * i, 1 - 2 * d - 2 * u),
                    o = Math.asin(2 * s),
                    n = Math.atan2(2 * e * r - 2 * t * i, 1 - 2 * l - 2 * u);
                    var c = new THREE.Vector3(o,n,a);
                    return c
                }
                function s(e, t) {
                    return 2 * Math.PI * e / t * g.rotateSpeed
                }
                function c(e, t) {
                    return 2 * Math.PI * e / t * g.rotateSpeed
                }
                function l(e) {
                    _ = !0;
                    var t = e.clientX || e.changedTouches[0].clientX
                      , i = e.clientY || e.changedTouches[0].clientY;
                    w.set(t, i)
                }
                function d(e) {
                    var t = e.clientX || e.changedTouches[0].clientX
                      , i = e.clientY || e.changedTouches[0].clientY;
                    x.set(t, i),
                    R.subVectors(x, w);
                    var r = void 0 !== g.domElement.clientWidth ? g.domElement.clientWidth : window.innerWidth;
                    o(s(R.x, r));
                    var a = void 0 !== g.domElement.clientHeight ? g.domElement.clientHeight : window.innerHeight;
                    n(c(R.y, a)),
                    w.copy(x)
                }
                function u(e) {
                    _ = !1
                }
                function m(e) {
                    _ = !0,
                    w.set(e.touches[0].pageX, e.touches[0].pageY),
                    g.usingGyro = !1
                }
                function h(e) {
                    e.preventDefault(),
                    x.set(e.touches[0].pageX, e.touches[0].pageY),
                    R.subVectors(x, w);
                    var t = void 0 != g.domElement.clientWidth ? g.domElement.clientWidth : window.innerWidth;
                    o(s(R.x, t));
                    var i = void 0 !== g.domElement.clientHeight ? g.domElement.clientHeight : window.innerHeight;
                    n(c(R.y, i)),
                    w.copy(x),
                    H.x += s(R.x, t) + c(R.y, i),
                    g.usingGyro = !1
                }
                function v(e) {
                    g.usingGyro = !!r.OS.isMobile(),
                    _ = !1
                }
                function f(e) {
                    g.deviceOrientation = e,
                    void 0 === g.beginAlpha && (g.beginAlpha = g.deviceOrientation.alpha)
                }
                function p(e) {
                    g.screenOrientation = window.orientation || 0
                }
                this.domElement = void 0 !== t ? t : document,
                this.object = e,
                this.object.rotation.reorder("YXZ"),
                this.enable = !0,
                this.target = new THREE.Vector3,
                this.minPolarAngle = 0,
                this.maxPolarAngle = Math.PI,
                this.minAzimuthAngle = -(1 / 0),
                this.maxAzimuthAngle = 1 / 0,
                this.enableDamping = !1,
                this.dampingFactor = .05,
                this.rotateSpeed = .25,
                this.autoRotate = !1,
                this.autoRotateSpeed = 1,
                this.deviceOrientation = {},
                this.screenOrientation = 0;
                var g = this;
                g.defaultDirectionOfRotation = !0,
                g.gyroEnable = !1,
                g.usingGyro = !!r.OS.isMobile(),
                g._defaultTargetY = g.target.y,
                g._defaultCameraFov = g.object.fov,
                g._defaultCameraY = g.object.position.y;
                var E = {
                    type: "change"
                }
                  , T = 1e-6
                  , y = new THREE.Spherical
                  , b = new THREE.Spherical
                  , w = new THREE.Vector2
                  , x = new THREE.Vector2
                  , R = new THREE.Vector2
                  , H = new THREE.Vector3(0,0,0)
                  , C = 0
                  , S = 0
                  , L = 0
                  , P = 0
                  , M = 0;
                this.target0 = this.target.clone(),
                this.position0 = this.object.position.clone(),
                this.rotation0 = this.object.rotation.clone(),
                this.zoom0 = this.object.zoom,
                this.arrowLeft = 37,
                this.arrowUp = 38,
                this.arrowRight = 39,
                this.arrowDown = 40,
                this.arrowSpeed = .05,
                this.getPolarAngle = function() {
                    return y.phi
                }
                ,
                this.getAzimuthalAngle = function() {
                    return y.theta
                }
                ,
                this.saveState = function() {
                    g.target0.copy(g.target),
                    g.position0.copy(g.object.position),
                    g.rotation0.copy(g.object.rotation),
                    g.zoom0 = g.object.zoom
                }
                ,
                this.reset = function(e) {
                    this.resetVar(),
                    g.dispatchEvent(E),
                    e && e.target0 ? g.target.copy(e.target0) : g.target.copy(g.target0),
                    e && e.position0 ? g.object.position.copy(e.position0) : g.object.position.copy(g.position0),
                    e && e.rotation0 ? g.object.rotation.copy(e.rotation0) : g.object.rotation.copy(g.rotation0),
                    e && e.zoom0 ? g.zoom = zoom0 : g.zoom0
                }
                ,
                this.resetVar = function() {
                    L = 0,
                    P = 0,
                    M = 0,
                    C = 0,
                    S = 0
                }
                ;
                var A = function() {
                    var e = new THREE.Vector3(0,0,1)
                      , t = new THREE.Euler
                      , i = new THREE.Quaternion
                      , r = new THREE.Quaternion((-Math.sqrt(.5)),0,0,Math.sqrt(.5));
                    return function(o, n, a, s, c) {
                        t.set(a, n, -s, "YXZ"),
                        o.setFromEuler(t),
                        o.multiply(r),
                        o.multiply(i.setFromAxisAngle(e, -c))
                    }
                }();
                this.update = function() {
                    var t = new THREE.Vector3
                      , r = (new THREE.Quaternion).setFromUnitVectors(e.up, new THREE.Vector3(0,1,0))
                      , n = r.clone().inverse()
                      , s = new THREE.Vector3
                      , c = new THREE.Quaternion;
                    return function(e) {
                        if (g.enable) {
                            e = e || {};
                            var l = g.deviceOrientation.alpha ? THREE.Math.degToRad(void 0 === g.beginAlpha ? g.deviceOrientation.alpha : g.deviceOrientation.alpha - g.beginAlpha) : 0
                              , d = g.deviceOrientation.beta ? THREE.Math.degToRad(g.deviceOrientation.beta) : 0
                              , u = g.deviceOrientation.gamma ? THREE.Math.degToRad(g.deviceOrientation.gamma) : 0
                              , m = g.screenOrientation ? THREE.Math.degToRad(g.screenOrientation) : 0;
                            g.gyroEnable ? (L = l,
                            P = d,
                            M = u) : (l = L,
                            d = P,
                            u = M);
                            var h = (new THREE.Quaternion).copy(g.object.quaternion);
                            A(h, l, d, u, m);
                            var v = a(h.x, h.y, h.z, h.w);
                            e.init || o(C - v.z),
                            S = v.y,
                            C = v.z;
                            var f = g.object.position;
                            return t.copy(f).sub(g.target),
                            t.applyQuaternion(r),
                            y.setFromVector3(t),
                            g.autoRotate && o(i()),
                            y.theta += b.theta,
                            y.phi += b.phi,
                            y.theta = Math.max(g.minAzimuthAngle, Math.min(g.maxAzimuthAngle, y.theta)),
                            y.phi = Math.max(g.minPolarAngle, Math.min(g.maxPolarAngle, y.phi)),
                            y.makeSafe(),
                            t.setFromSpherical(y),
                            t.applyQuaternion(n),
                            f.copy(g.target).add(t),
                            g.deviceOrientation && g.gyroEnable ? A(g.object.quaternion, l + Math.PI + H.x, d + H.y, u + H.z, m) : g.object.lookAt(g.target),
                            g.enableDamping && !g.gyroEnable ? (b.theta *= 1 - g.dampingFactor,
                            b.phi *= 1 - g.dampingFactor) : b.set(0, 0, 0),
                            (s.distanceToSquared(g.object.position) > T || 8 * (1 - c.dot(g.object.quaternion)) > T) && (g.dispatchEvent(E),
                            s.copy(g.object.position),
                            c.copy(g.object.quaternion),
                            !0)
                        }
                    }
                }();
                var _ = !1
                  , k = null;
                "undefined" != typeof DeviceMotionEvent && (k = DeviceMotionEvent),
                "undefined" != typeof DeviceOrientationEvent && (k = DeviceOrientationEvent),
                window.addEventListener("orientationchange", p, !1),
                window.addEventListener("deviceorientation", f, !1),
                k && "function" == typeof k.requestPermission && window.addEventListener("click", function() {
                    k.requestPermission().then(function(e) {
                        "granted" === e && (window.addEventListener("devicemotion", p, !1),
                        window.addEventListener("deviceorientation", f, !1))
                    })["catch"](function(e) {
                        r.msgBox(e, 3, document.body)
                    })
                }),
                this.gyroFreeze = function() {
                    g.gyroEnable = !1
                }
                ,
                this.gyroUnfreeze = function() {
                    g.gyroEnable = !0
                }
                ,
                this.rotationLeft = o,
                this.rotationUp = n;
                var B = 0
                  , I = 0;
                document.addEventListener("keydown", function(e) {
                    var t = e || window.event || arguments.callee.caller.arguments[0];
                    t && (t.keyCode == g.arrowLeft && (I = 1),
                    t.keyCode == g.arrowRight && (I = -1),
                    t.keyCode == g.arrowUp && (B = 1),
                    t.keyCode == g.arrowDown && (B = -1),
                    o(I * g.arrowSpeed),
                    n(B * g.arrowSpeed))
                }),
                document.addEventListener("keyup", function(e) {
                    var t = e || window.event || arguments.callee.caller.arguments[0];
                    t && (t.keyCode == g.arrowLeft && (I = 0),
                    t.keyCode == g.arrowRight && (I = 0),
                    t.keyCode == g.arrowUp && (B = 0),
                    t.keyCode == g.arrowDown && (B = 0))
                }),
                this.domElement.addEventListener("mousedown", l, !1),
                this.domElement.addEventListener("mousemove", function(e) {
                    g.enable && _ && d(e)
                }, !1),
                this.domElement.addEventListener("mouseup", u, !1),
                this.domElement.addEventListener("touchstart", m, !1),
                this.domElement.addEventListener("touchend", v, !1),
                this.domElement.addEventListener("touchmove", h, !1);
                var V = void 0 !== this.domElement.clientWidth ? this.domElement.clientWidth : window.innerWidth
                  , F = void 0 !== this.domElement.clientHeight ? this.domElement.clientHeight : window.innerHeight;
                return w.set(V / 2, F / 2),
                setTimeout(function() {
                    g.update({
                        init: !0
                    }),
                    g.saveState()
                }, 10),
                this
            };
            return i.prototype = Object.create(THREE.EventDispatcher.prototype),
            i.prototype.constructor = i,
            new i(e,t)
        },
        setCameraPara: function(e, t, i) {
            if (e.cameraPara = {
                fov: 90,
                aspect: e.container.innerWidth / e.container.innerHeight,
                near: .001,
                far: 1e3
            },
            e.cameraPosition = {
                x: 0,
                y: 0,
                z: 0
            },
            t)
                for (var r in t)
                    e.cameraPara[r] = t[r];
            if (i)
                for (var r in i)
                    e.cameraPosition[r] = i[r]
        },
        formatSeconds: function(e) {
            var t = parseInt(e);
            if (!t)
                return "00:00";
            var i = 0
              , r = 0;
            t > 60 && (i = parseInt(t / 60),
            t = parseInt(t % 60),
            i > 60 && (r = parseInt(i / 60),
            i = parseInt(i % 60)));
            var o = "" + (parseInt(t) < 10 ? "0" + parseInt(t) : parseInt(t));
            return o = i >= 0 && r > 0 ? (parseInt(r) < 10 ? "0" + parseInt(r) : parseInt(r)) + ":" + (parseInt(i) < 10 ? "0" + parseInt(i) : parseInt(i)) + ":" + o : i > 0 && 0 == r ? 60 == i ? "01:00:" + o : (parseInt(i) < 10 ? "0" + parseInt(i) : parseInt(i)) + ":" + o : 60 == t ? "01:00" : "00:" + o
        },
        cameraVector: function(e, t) {
            var i = new THREE.Vector3(0,0,(-1))
              , r = i.applyQuaternion(e.quaternion)
              , o = r.clone()
              , n = new THREE.Vector3;
            return t && (n.x = r.x * t,
            n.y = r.y * t,
            n.z = r.z * t),
            {
                vector: o,
                timesVector: n
            }
        },
        bindRaycaster: function(e, t, i) {
            var o = r.screenPosTo3DCoordinate(e, t.container, t.camera)
              , n = new THREE.Raycaster(t.camera.position,o.sub(t.camera.position).normalize())
              , a = n.intersectObjects(t.scene.children, !0);
            a.length ? i.success(a) : i.empty()
        },
        bindCameraEvent: function(e, t) {
            t = t || {
                trigger: function(e) {},
                empty: function(e) {},
                move: function(e) {}
            };
            var i = this
              , r = t.scale || .022
              , o = t.vectorRadius
              , n = o * r
              , a = o * (r / 6)
              , s = 2
              , c = t.tubularSegments || 60
              , l = t.speed || 36
              , d = new THREE.Group;
            d.name = "__controlHandle";
            for (var u = new THREE.TorusGeometry(n,a,s,c,2 * Math.PI), m = [], h = 0; h < u.faces.length / 2; h++)
                m[h] = new THREE.MeshBasicMaterial({
                    color: 15194842,
                    depthTest: !1
                });
            for (var v = 0, f = [new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(1,1), new THREE.Vector2(0,1)], h = 0, p = u.faces.length; h < p; h += 2)
                u.faces[h].materialIndex = v,
                u.faces[h + 1].materialIndex = v,
                u.faceVertexUvs[0][h] = [f[3], f[0], f[2]],
                u.faceVertexUvs[0][h + 1] = [f[0], f[1], f[2]],
                v++;
            var g = new THREE.Mesh(u,m);
            g.name = "__wait",
            g.visible = !1,
            d.add(g);
            var E = new THREE.Mesh(new THREE.CircleGeometry(a,4),new THREE.MeshBasicMaterial({
                color: 15194842,
                wireframe: !0,
                depthTest: !1
            }));
            E.lookAt(e.camera.position),
            E.name = "__focus",
            E.material.depthTest = !1,
            E.visible = !1,
            d.add(E),
            d.position.set(0, 0, .1);
            var T = (new THREE.Vector3,
            function() {
                d.lookAt(0, 0, 0),
                g.lookAt(0, 0, 0);
                var r = i.cameraVector(e.camera, o);
                E.visible = !0,
                d.position.set(r.timesVector.x, r.timesVector.y, r.timesVector.z);
                var n = new THREE.Raycaster(e.camera.position,r.vector)
                  , a = n.intersectObjects(e.scene.children, !0);
                a.length ? t.move(a) : t.empty(a)
            }
            )
              , y = null
              , b = function(e) {
                g.visible = !0;
                var i = 0
                  , r = 0;
                y || (y = setInterval(function() {
                    r < u.faces.length / 4 ? (m[r].color = new THREE.Color(14710133),
                    u.needsUpdate = !0,
                    u.faces[i].materialIndex = r,
                    u.faces[i + 1].materialIndex = r,
                    u.faceVertexUvs[0][i] = [f[3], f[0], f[2]],
                    u.faceVertexUvs[0][i + 1] = [f[0], f[1], f[2]],
                    i += 2) : (clearInterval(y),
                    y = null,
                    t.trigger(e)),
                    r++
                }, l))
            }
              , w = function(e) {
                clearInterval(y),
                y = null,
                v = 0;
                for (var t = 0, i = u.faces.length; t < i; t += 2)
                    m[v].color = new THREE.Color(15194842),
                    u.needsUpdate = !0,
                    u.faces[t].materialIndex = v,
                    u.faces[t + 1].materialIndex = v,
                    u.faceVertexUvs[0][t] = [f[3], f[0], f[2]],
                    u.faceVertexUvs[0][t + 1] = [f[0], f[1], f[2]],
                    v++;
                g.visible = !1
            };
            e.VRObject.add(d),
            e.cameraEvt.controlGroup = d,
            e.cameraEvt.updatePosition = T,
            e.cameraEvt.hover = b,
            e.cameraEvt.leave = w
        },
        screenPosTo3DCoordinate: function(e, t, i) {
            var o = e.clientX || (e.touches ? e.touches[0].clientX : 0)
              , n = e.clientY || (e.touches ? e.touches[0].clientY : 0);
            rect = r.getBoundingClientRect(t),
            x = o - rect.left,
            y = n - rect.top;
            var a = t.clientWidth
              , s = t.clientHeight
              , c = new THREE.Vector2;
            c.x = 2 * x / a - 1,
            c.y = 1 - 2 * y / s;
            var l = new THREE.Vector3(c.x,c.y,0).unproject(i);
            return l.sub(i.position).normalize()
        },
        objectPosToScreenPos: function(e, t, i) {
            var r = new THREE.Vector3;
            r.setFromMatrixPosition(e.matrixWorld).project(i);
            var o = r.x
              , n = r.y
              , a = t.clientWidth
              , s = t.clientHeight
              , c = new THREE.Vector2;
            return c.x = a / 2 * (o + 1),
            c.y = s / 2 * (1 - n),
            c
        },
        fullscreen: function(e) {
            var t = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || !1;
            t ? document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : "" : e.requestFullscreen && e.requestFullscreen() || e.mozRequestFullScreen && e.mozRequestFullScreen() || e.webkitRequestFullscreen && e.webkitRequestFullscreen() || e.msRequestFullscreen && e.msRequestFullscreen()
        },
        isFullscreen: function() {
            return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || !1
        },
        toolBar: function(e) {
            function t(e) {
                for (var t = e.match(/&#(\d+);/g), i = "", r = 0; r < t.length; r++)
                    i += String.fromCharCode(t[r].replace(/[&#;]/g, ""));
                return i
            }
            var i = "_toolBar"
              , o = this.createTag("div", {
                style: "-moz-user-select:none;-webkit-user-select:none;user-select:none;position:absolute;background:rgba(0,0,0,.2);width:100%;height:2.2rem;bottom:0rem",
                "class": i + "Area"
            })
              , n = this.createTag("div", {
                style: "position:inherit;border-top:0.6rem solid transparent;border-left:1rem solid white;border-bottom:0.6rem solid transparent;bottom:0.25rem;left:1rem;color:#fff;font-weight:800;cursor:pointer",
                "class": i + "Btn"
            });
            o.appendChild(n);
            var a = this.createTag("div", {
                style: "position:inherit;bottom:0.25rem;left:2.8rem;color:#fff;font-size:0.75rem"
            })
              , s = this.createTag("span", null, {
                innerText: "00:00"
            });
            a.appendChild(s);
            var c = this.createTag("span", null, {
                innerText: "/"
            });
            a.appendChild(c);
            var l = this.createTag("span", null, {
                innerText: "00:00"
            });
            a.appendChild(l),
            o.appendChild(a);
            var d = document.styleSheets[0];
            d.insertRule("@keyframes moreTip{from {top:0.75rem;} to{top:1rem}}", 0),
            r.Broswer.isIE() || d.insertRule("@-webkit-keyframes moreTip{from {top:0.75rem;} to{top:1rem}}", 0);
            var u = this.createTag("span", {
                style: "width:2.2rem;height:2.2rem;position:inherit;left:50%;margin-left:-1.1rem;margin-top:-0.75rem;color:#fff;font-size:1.5rem;cursor:pointer;margin-top:1rem;border:0.0625rem dotted #ccc;height:0.0625rem;"
            }, {
                innerHTML: ""
            })
              , m = this.createTag("div", {
                style: "width:100%;height:auto;position:inherit;background:rgba(0,0,0,0);top:2.4rem;bottom:1.8rem;overflow: hidden;"
            }, null)
              , h = this.createTag("ul", {
                style: "display:flex;display: -webkit-flex;display: -webkit-box;display: -moz-box;display: -ms-flexbox;margin:0;padding:0;list-style:none;height:100%;"
            }, null);
            m.appendChild(h),
            o.appendChild(u),
            o.appendChild(m);
            var v = this.createTag("div", {
                style: "width:2.2rem;height:2.2rem;position:inherit;right:1rem;margin-left:-1.1rem;margin-top:0.6rem;color:#fff;font-size:1.2rem;cursor:pointer;display:none",
                copy: "&#86;&#82;&#98;&#111;&#120;&#25903;&#25345;&#109;&#51;&#117;&#56;&#44;&#102;&#108;&#118;&#44;&#109;&#107;&#118;"
            }, {
                innerText: "VR@"
            });
            v.addEventListener("click", function() {
                var e = this.getAttribute("copy");
                alert(t(e))
            }, !1),
            v.addEventListener("mouseover", function() {
                var e = this.getAttribute("copy");
                this.setAttribute("title", t(e))
            }, !1),
            o.appendChild(v);
            var f = this.createTag("div", {
                style: "border:0.125rem solid white;border-radius:1rem;width:1rem;height:1rem;position:inherit;right:5.8rem;line-height:1rem;bottom:0.25rem;cursor:pointer"
            })
              , p = this.createTag("div", {
                style: "border:0.08rem solid white;border-radius:8rem;background:rgba(240,240,240,0.6);width:0.3rem;left:0.26rem;top:0.26rem;height:0.3rem;position:inherit;line-height:0.3rem;cursor:pointer"
            });
            f.appendChild(p),
            o.appendChild(f);
            var g = this.createTag("div", {
                style: "border:0.125rem solid white;border-radius:1rem;width:1.4rem;height:1rem;position:inherit;right:3.5rem;line-height:1rem;bottom:0.25rem;cursor:pointer"
            })
              , E = this.createTag("div", {
                style: "position:inherit;width:1.235rem;height:0.4rem;line-height:0.4rem;border:0.0625rem solid white;border-radius:0.6rem/0.2rem;margin-top:0.25rem;margin-left:0.055rem;"
            });
            g.appendChild(E);
            var T = this.createTag("div", {
                style: "position:inherit;width:1rem;height:0.4rem;line-height:0.4rem;border:0.0625rem solid white;border-radius:0.6rem/0.2rem;margin-top:0.25rem;margin-left:0.175rem;transform:rotate(90deg)"
            });
            g.appendChild(T),
            o.appendChild(g);
            var y = this.createTag("div", {
                style: "position:inherit;right:1rem;width:1.4rem;height:1rem;line-height:1rem;border:0.125rem solid white;border-radius:0.125rem;bottom:0.25rem;text-align:center;font-weight:800;color:#fff;font-size:0.75rem;cursor:pointer"
            }, {
                innerText: "VR"
            });
            o.appendChild(y);
            var b = this.createTag("div", {
                style: "position:inherit;top:0rem;width:100%;height:0.5rem;background:rgba(255,255,255,.3);cursor:pointer"
            })
              , w = this.createTag("div", {
                style: "position:inherit;width:0%;height:0.5rem;background:rgba(255,255,255,.3)"
            });
            b.appendChild(w);
            var x = this.createTag("div", {
                style: "position:inherit;width:0%;height:0.5rem;background:rgba(28, 175, 252,.6)"
            });
            b.appendChild(x),
            o.appendChild(b),
            e.appendChild(o);
            var R = this.createTag("div", {
                style: "-moz-user-select:none;-webkit-user-select:none;user-select:none;position:absolute;width:2rem;height:60%;background:rgba(0,0,0,0);left:0rem;top:20%;text-align:center;display:none;border-radius:1rem;"
            })
              , H = this.createTag("div", {
                style: "position:inherit;width:0.25rem;background:rgba(255,255,255,.1);height:100%;left:0.875rem;cursor:pointer;border-radius:1rem;"
            });
            R.appendChild(H);
            var C = this.createTag("div", {
                style: "position:inherit;width:100%;background:rgba(255, 255, 255,.6);bottom:0rem;;border-radius:1rem;"
            });
            return H.appendChild(C),
            e.appendChild(R),
            {
                toolbar: o,
                btn: n,
                timeInfo: a,
                curTime: s,
                splitTime: c,
                totalTime: l,
                moreBtn: u,
                moreList: m,
                moreListUl: h,
                vrBtn: y,
                progressBar: b,
                loadedProgress: w,
                playProgress: x,
                gyroResetBtn: f,
                gyroBtn: g,
                circle1: E,
                circle2: T,
                voice_bar: R,
                about: v
            }
        },
        msgBox: function(e, t, i) {
            if (e) {
                var r = this.createTag("div", {
                    style: "position:absolute;bottom:50%;width:100%;padding:0.25rem;background:rgba(0,0,0,.6);color:#fff;text-align:center;"
                }, {
                    innerHTML: e
                });
                i.appendChild(r),
                setTimeout(function() {
                    r.remove()
                }, 1e3 * t)
            }
        },
        isMobileDevice: function(e) {
            var t = navigator.userAgent.toLowerCase();
            if (e)
                return t.match(/ipad/i) || t.match(/iphone os/i) || t.match(/midp/i) || t.match(/rv:1.2.3.4/i) || t.match(/ucweb/i) || t.match(/android/i) || t.match(/windows ce/i) || t.match(/windows mobile/i);
            var i = "ipad" == t.match(/ipad/i)
              , r = "iphone os" == t.match(/iphone os/i)
              , o = "midp" == t.match(/midp/i)
              , n = "rv:1.2.3.4" == t.match(/rv:1.2.3.4/i)
              , a = "ucweb" == t.match(/ucweb/i)
              , s = "android" == t.match(/android/i)
              , c = "windows ce" == t.match(/windows ce/i)
              , l = "windows mobile" == t.match(/windows mobile/i);
            return !!(i || r || o || n || a || s || c || l)
        },
        bindOrientationEvent: function(e) {
            void 0 === e.controls && (e.controls = r.orbitControls(e.camera, e.renderer.domElement),
            e.controls.target = e._controlTarget.clone())
        },
        isCrossScreen: function(e) {
            return 180 != window.orientation && 0 != window.orientation && (90 == window.orientation || window.orientation == -90 || void 0)
        },
        initDomStyle: function(e) {
            function t(e) {
                e.preventDefault()
            }
            document.body.style.overflow = "hidden",
            document.body.style.margin = 0,
            document.body.style.padding = 0,
            e.style.position = "absolute",
            e.style.width = "100%",
            e.style.height = "100%",
            e.style.left = "0px",
            e.style.top = "0px",
            e.style.overflow = "hidden";
            var i = document.createElement("style");
            document.getElementsByTagName("head")[0].appendChild(i),
            document.body.addEventListener("touchmove", t),
            document.oncontextmenu = function() {
                return !1
            }
            ,
            document.onkeydown = function() {
                if (!this.debug && window.event && 123 == window.event.keyCode)
                    return event.keyCode = 0,
                    event.returnValue = !1,
                    !1
            }
        },
        createTag: function(e, t, i) {
            var r = document.createElement(e);
            if (t && "object" == typeof t)
                for (var o in t)
                    r.setAttribute(o, t[o]);
            if (i && "object" == typeof i)
                for (var o in i)
                    r[o] = i[o];
            return r
        },
        OS: {
            weixin: navigator.userAgent.indexOf("MicroMessenger") > -1,
            android: /android/i.test(navigator.userAgent.toLowerCase()),
            ios: /(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase()),
            googlePixel: navigator.userAgent.match(/;\sPixel\sBuild\//),
            MiOS: navigator.userAgent.match(/;\sMI\s\d\sBuild\//),
            samsungOS: navigator.userAgent.match(/;\sSM\-\w+\sBuild\//),
            isGooglePixel: function() {
                return null != this.googlePixel
            },
            isMiOS: function() {
                return null != this.MiOS
            },
            isSamsung: function() {
                return null != this.samsungOS
            },
            isMobile: function() {
                return this.android || this.ios
            },
            isAndroid: function() {
                return this.android
            },
            isiOS: function() {
                return this.ios
            },
            isWeixin: function() {
                return this.weixin
            }
        },
        Broswer: {
            win: window,
            nav: window.navigator,
            REG_APPLE: /^Apple/,
            ie: navigator.userAgent.match(/MSIE\s([\d.]+)/) || navigator.userAgent.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
            edge: navigator.userAgent.match(/Edge\/([\d.]+)/),
            chrome: navigator.userAgent.match(/Chrome\/([\d.]+)/) || navigator.userAgent.match(/CriOS\/([\d.]+)/),
            webview: !this.chrome && navigator.userAgent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
            safari: this.webview || navigator.userAgent.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
            chromiumType: null,
            _getChromiumType: function() {
                if (null != this.chromiumType)
                    return this.chromiumType;
                var e = this.win;
                return this.isIE() || void 0 === e.scrollMaxX || this.REG_APPLE.test(this.nav.vendor || "") ? "" : this._testExternal(/^sogou/i, 0) ? "sogou" : this._testExternal(/^liebao/i, 0) ? "liebao" : this.nav.mimeTypes[30] || !this.nav.mimeTypes.length ? "360" : e.clientInformation && e.clientInformation.permissions ? "chrome" : ""
            },
            _testExternal: function(e, t) {
                var i = this.win.external || {};
                for (var r in i)
                    if (e.test(t ? i[r] : r))
                        return !0;
                return !1
            },
            isIE: function() {
                return null != this.ie
            },
            ieVersion: function() {
                return null != this.ie && parseInt(this.ie[1])
            },
            isEdge: function() {
                return null != this.edge
            },
            isSafari: function() {
                return null != this.safari
            },
            is360: function() {
                return this.chromiumType = this._getChromiumType(),
                "360" === this.chromiumType
            },
            isSogou: function() {
                return this.chromiumType = this._getChromiumType(),
                "sogou" === this.chromiumType
            },
            isChromium: function() {
                return "chrome" === this._getChromiumType()
            },
            webglAvailable: function() {
                try {
                    var e = document.createElement("canvas");
                    return !(!window.WebGLRenderingContext || !e.getContext("webgl") && !e.getContext("experimental-webgl"))
                } catch (t) {
                    return !1
                }
            }
        },
        getBoundingClientRect: function(e) {
            var t = e.getBoundingClientRect()
              , i = t.top - document.documentElement.clientTop + document.documentElement.scrollTop
              , r = t.bottom
              , o = t.left - document.documentElement.clientLeft + document.documentElement.scrollLeft
              , n = t.right
              , a = t.width || n - o
              , s = t.height || r - i;
            return {
                top: i,
                right: n,
                bottom: r,
                left: o,
                width: a,
                height: s
            }
        }
    }
      , o = document.getElementsByTagName("head")[0];
    o.appendChild(r.createTag("meta", {
        name: "viewport",
        content: "width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0,minimal-ui,user-scalable=no"
    })),
    o.appendChild(r.createTag("meta", {
        name: "google",
        content: "notranslate"
    })),
    o.appendChild(r.createTag("meta", {
        name: "full-screen",
        content: "yes"
    })),
    r.debug && (window.onerror = function(e, t, i) {
        var o = "There was an error on this page.\n\n";
        return o += "Error: " + e + "\n",
        o += "URL: " + t + "\n",
        o += "Line: " + i + "\n\n",
        r.msgBox(o, 36, document.body),
        !0
    }
    ),
    e.VR = t,
    e.AR = i,
    e.AVR = r
});
